const initTreeMap = (data,element,config, queryResponse) => {
    var myChart = echarts.init(element);

    myChart.showLoading();
    const indexSize = 0;
    const indexColor = 1;
    const normalizeStepper = () => {
        let steps = config.stepper_values
        // TODO calculate median
        if (steps.length < config.colors.length) {
            for (const i in config.colors){
                if ( !steps[i] ){
                    steps[i] = config.color_max
                }
            }
        }

        let breakPointsStepperValues = []
        for (stepI in steps){
            const step = +steps[stepI];
            breakPointsStepperValues.push({
                step,
                // proportion to 0-1
                percentage: echarts.number.linearMap(+stepI,[0,steps.length - 1],[0,1],false)
            })
        }
        return breakPointsStepperValues
    }

    const steps = normalizeStepper()

    const proportionValue = (val) => {
        let proportionedValue = val
        let lastStep = {
            step: 0,
            percentage: 0
        }
        for (const stepI in steps ){
            const step = steps[stepI]
            if (val <= step.step || +stepI === steps.length - 1 ){
                const proportionToStart = lastStep.percentage
                let proportionToAdd = val * step.percentage / step.step
                if (proportionToStart > 0) {
                    const percentageToAdd = val - lastStep.step
                    proportionToAdd = percentageToAdd * (1 - lastStep.percentage) / (step.step - lastStep.percentage)
                }

                proportionedValue = proportionToStart + proportionToAdd
                break;
            }else{
                lastStep = step
            }
        }
        return proportionedValue;
    }

    convertData(data);
    function convertData(originList) {
        for (let i = 0; i < originList.length; i++) {
            let node = originList[i];

            if (node) {
                let value = [null,null];
                queryResponse.fields.measure_like.forEach((measure_like,i) => {
                    if (i === config.size_field){
                        value[indexSize] = node[measure_like.name].value
                    }
                    if (i === config.color_field){
                        value[indexColor] = node[measure_like.name].value
                    }
                })
                if (config.enable_stepper_values){
                    value.push(proportionValue(value[indexColor]))
                }
                originList[i].value = value

                if (node.children) {
                    convertData(node.children);
                }
            }
        }
    }
    let position = ['50%','50%']
    if ( config.align === "left"){
        position[0] = '5px'
    }
    if ( config.vertical_align === "top"){
        position[1] = '5px'
    }

    // If the user stepped the values, the index qill be the last (2) otherwise is the indexcolor (1)
    const visualDimension = (config.enable_stepper_values ) ? 2 : indexColor
    const visualMin = (config.enable_stepper_values ) ?0 : config.color_min
    const visualMax = (config.enable_stepper_values ) ? 1 : config.color_max
    myChart.setOption(
        (option = {

            tooltip: {
                // show:false,
                formatter: function (row) {

                    let label ='';
                    if ( queryResponse.fields.dimensions.length ){
                        const dimension = queryResponse.fields.dimensions[0]
                        if (row.data[dimension.name]){
                            label = row.data[dimension.name].value
                        }else{
                            label = dimension.label_short ? dimension.label_short :  dimension.label
                        }
                    }
                    const labelFormatted =`<b style="font-size:${config.font_size}">${label}</b><br />`;
                    return labelFormatted + queryResponse.fields.measure_like.map((measure) => {
                        const label = measure.label_short ?  measure.label_short: measure.label
                        // return `${label}: ${row.data[measure.name].value} \n`
                        const value = row.data[measure.name] ? row.data[measure.name].rendered : '-'
                        // console.log(measure.value_format)
                        return `<b>${label}</b>: ${value} <br />`
                    }).join('')
                }
            },
            series: [
                {
                    // TODO -> set name
                    name: '',
                    // top: 80,
                    roam : false,
                    // squareRatio: .2,
                    // silent: true,
                    type: 'treemap',
                    width: "100%",
                    height: "100%",
                    nodeClick : false,
                    breadcrumb: {
                        show:false,
                    },
                    label: {
                        show: true,
                        verticalAlign: config.vertical_align, //'middle',
                        align: config.align,
                        fontSize: config.font_size,
                        fontFamily: '"Roboto", "Noto Sans", "Noto Sans JP", "Noto Sans CJK KR", "Noto Sans Arabic UI", "Noto Sans Devanagari UI", "Noto Sans Hebrew", "Noto Sans Thai UI", Helvetica, Arial, sans-serif',
                        offset: 0,
                        padding: 0,
                        position: position,
                        formatter: (row) => {
                            let label ='';
                            if ( queryResponse.fields.dimensions.length ){
                                const dimension = queryResponse.fields.dimensions[0]
                                if (row.data[dimension.name]){
                                    label = row.data[dimension.name].value
                                }else{
                                    label = dimension.label_short ? dimension.label_short :  dimension.label
                                }
                            }
                            return label
                        },
                        overflow: 'truncate',
                        ellipsis: '-'
                    },
                    itemStyle: {
                        borderColor: 'white',
                        borderWidth: config.gap_width,
                        borderRadius: config.tile_border_radius,
                        borderColorSaturation: config.border_color_saturation
                    },
                    visualMin,
                    visualMax,
                    visualDimension,
                    levels: [
                        {
                            color: config.colors ? config.colors : ['#942e38', '#d4d120', '#269f3c'],
                            colorMappingBy: 'value',
                        }
                    ],
                    data: data
                }
            ]
        })
    );
    myChart.resize();
    myChart.hideLoading();

}

const visObject = {
    options: {
        color_field: {
            type: "number",
            label: "Column number of the measure (counting only the measures)",
            display: "text",
            default: 0, //"history.max_runtime",
            section: "COLOR",
            order: 2,
        },
        color_instructions: {
            type: "string",
            label: "Min and max values for an absolute number range - leave it empty for a relative color range",
            section: "COLOR",
            display: "divider",
            order: 3
        },
        color_min: {
            type: "number",
            label: "Min",
            display: "number",
            section: "COLOR",
            default: 0,
            order: 5,
        },
        color_max: {
            type: "number",
            label: "Max",
            display: "number",
            section: "COLOR",
            default: 1,
            order: 6,
        },
        colors: {
            type: 'array',
            label: "Colors",
            display: 'colors',
            // display: 'palette',
            section: "COLOR",
            // showGradient: true,
            'show-Gradient': true,
            order: 7,
            default: ['#942e38', '#d4d120', '#269f3c']
        },
        enable_stepper_values: {
            type: "boolean",
            section: "COLOR",
            default: false,
            label: "Enable steps values",
            order: 8,
        },
        stepper_values_instructions: {
            type: "string",
            label: "If enabled, specify a comma separed valued (relative to the min and max), it is better to specify as many steps as the colors.",
            section: "COLOR",
            display: "divider",
            order: 9
        },
        stepper_values: {
            type: 'array',
            label: "Steps Values",
            display: 'text',
            // display: 'palette',
            section: "COLOR",
            order: 10,
            default: [0,0.5,1]
        },
        size_field: {
            type: "number",
            label: "Column number of the measure (counting only the measures)",
            // label: "Field name (in the LookML) for the colors",
            display: "text",
            default: 1,
            section: "SIZE",
            order: 2,
        },
        font_size: {
            type: "string",
            label: "Font size",
            section: "STYLE",
            display: "text",
            default: '18px',
            order: 1
        },
        vertical_align: {
            type: "string",
            label: "Vertical align",
            section: "STYLE",
            display: "select",
            default: 'middle',
            values: [
                {"Top": "top"},
                {"Center": "middle"},
            ],
            order: 2
        },
        align: {
            type: "string",
            label: "Horizontal align",
            section: "STYLE",
            display: "select",
            default: 'center',
            values: [
                {"Left": "left"},
                {"Center": "center"},
            ],
            order: 3
        },
        gap_width: {
            type: "number",
            label: "Gap size",
            section: "STYLE",
            display: "number",
            min: 0,
            max: 10,
            default: 0,
            order: 4
        },
        tile_border_radius: {
            type: "number",
            label: "Tile border radius ",
            section: "STYLE",
            display: "number",
            min: 0,
            max: 30,
            default: 0,
            order: 5
        },
        gap_width: {
            type: "number",
            label: "Gap size",
            section: "STYLE",
            display: "number",
            min: 0,
            max: 10,
            default: 0,
            order: 4
        },
        border_color_saturation: {
            type: "number",
            label: "Border color saturation",
            section: "STYLE",
            display: "number",
            min: 0,
            max: 1,
            step: 0.1,
            default: 1,
            order: 6
        },
    },

    create: function(element, config){
        element.innerHTML = "<div id='main'></div>";
    },

    updateAsync: function(data, element, config, queryResponse, details, done){
        if (config.colors !== undefined){
            initTreeMap(data,element,config, queryResponse);
        }
        done()
    }
};

looker.plugins.visualizations.add(visObject);
