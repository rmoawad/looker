const initTreeMap=(e,t,a,l)=>{var r=echarts.init(t);r.showLoading();const o=0,n=1,i=(()=>{let e=a.stepper_values;if(e.length<a.colors.length)for(const t in a.colors)e[t]||(e[t]=a.color_max);let t=[];for(stepI in e){const a=+e[stepI];t.push({step:a,percentage:echarts.number.linearMap(+stepI,[0,e.length-1],[0,1],!1)})}return t})(),s=e=>{let t=e,a={step:0,percentage:0};for(const l in i){const r=i[l];if(e<=r.step||+l==i.length-1){const l=a.percentage;let o=e*r.percentage/r.step;if(l>0){o=(e-a.step)*(1-a.percentage)/(r.step-a.percentage)}t=l+o;break}a=r}return t};!function e(t){for(let r=0;r<t.length;r++){let i=t[r];if(i){let d=[null,null];l.fields.measure_like.forEach((e,t)=>{t===a.size_field&&(d[o]=i[e.name].value),t===a.color_field&&(d[n]=i[e.name].value)}),a.enable_stepper_values&&d.push(s(d[n])),t[r].value=d,i.children&&e(i.children)}}}(e);let d=["50%","50%"];"left"===a.align&&(d[0]="5px"),"top"===a.vertical_align&&(d[1]="5px");const p=a.enable_stepper_values?2:n,u=a.enable_stepper_values?0:a.color_min,c=a.enable_stepper_values?1:a.color_max;r.setOption(option={tooltip:{formatter:function(e){let t="";if(l.fields.dimensions.length){const a=l.fields.dimensions[0];t=e.data[a.name]?e.data[a.name].value:a.label_short?a.label_short:a.label}return`<b style="font-size:${a.font_size}">${t}</b><br />`+l.fields.measure_like.map(t=>{return`<b>${t.label_short?t.label_short:t.label}</b>: ${e.data[t.name]?e.data[t.name].rendered:"-"} <br />`}).join("")}},series:[{name:"",roam:!1,type:"treemap",width:"100%",height:"100%",nodeClick:!1,breadcrumb:{show:!1},label:{show:!0,verticalAlign:a.vertical_align,align:a.align,fontSize:a.font_size,fontFamily:'"Roboto", "Noto Sans", "Noto Sans JP", "Noto Sans CJK KR", "Noto Sans Arabic UI", "Noto Sans Devanagari UI", "Noto Sans Hebrew", "Noto Sans Thai UI", Helvetica, Arial, sans-serif',offset:0,padding:0,position:d,formatter:e=>{let t="";if(l.fields.dimensions.length){const a=l.fields.dimensions[0];t=e.data[a.name]?e.data[a.name].value:a.label_short?a.label_short:a.label}return t},overflow:"truncate",ellipsis:"-"},itemStyle:{borderColor:"white",borderWidth:a.gap_width,borderRadius:a.tile_border_radius,borderColorSaturation:a.border_color_saturation},visualMin:u,visualMax:c,visualDimension:p,levels:[{color:a.colors?a.colors:["#942e38","#d4d120","#269f3c"],colorMappingBy:"value"}],data:e}]}),r.resize(),r.hideLoading()},visObject={options:{color_field:{type:"number",label:"Column number of the measure (counting only the measures)",display:"text",default:0,section:"COLOR",order:2},color_instructions:{type:"string",label:"Min and max values for an absolute number range - leave it empty for a relative color range",section:"COLOR",display:"divider",order:3},color_min:{type:"number",label:"Min",display:"number",section:"COLOR",default:0,order:5},color_max:{type:"number",label:"Max",display:"number",section:"COLOR",default:1,order:6},colors:{type:"array",label:"Colors",display:"colors",section:"COLOR","show-Gradient":!0,order:7,default:["#942e38","#d4d120","#269f3c"]},enable_stepper_values:{type:"boolean",section:"COLOR",default:!1,label:"Enable steps values",order:8},stepper_values_instructions:{type:"string",label:"If enabled, specify a comma separed valued (relative to the min and max), it is better to specify as many steps as the colors.",section:"COLOR",display:"divider",order:9},stepper_values:{type:"array",label:"Steps Values",display:"text",section:"COLOR",order:10,default:[0,.5,1]},size_field:{type:"number",label:"Column number of the measure (counting only the measures)",display:"text",default:1,section:"SIZE",order:2},font_size:{type:"string",label:"Font size",section:"STYLE",display:"text",default:"18px",order:1},vertical_align:{type:"string",label:"Vertical align",section:"STYLE",display:"select",default:"middle",values:[{Top:"top"},{Center:"middle"}],order:2},align:{type:"string",label:"Horizontal align",section:"STYLE",display:"select",default:"center",values:[{Left:"left"},{Center:"center"}],order:3},gap_width:{type:"number",label:"Gap size",section:"STYLE",display:"number",min:0,max:10,default:0,order:4},tile_border_radius:{type:"number",label:"Tile border radius ",section:"STYLE",display:"number",min:0,max:30,default:0,order:5},gap_width:{type:"number",label:"Gap size",section:"STYLE",display:"number",min:0,max:10,default:0,order:4},border_color_saturation:{type:"number",label:"Border color saturation",section:"STYLE",display:"number",min:0,max:1,step:.1,default:1,order:6}},create:function(e,t){e.innerHTML="<div id='main'></div>"},updateAsync:function(e,t,a,l,r,o){void 0!==a.colors&&initTreeMap(e,t,a,l),o()}};
looker.plugins.visualizations.add(visObject);
