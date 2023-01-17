(function(){"use strict";var t={718:function(t,e,s){var a=s(144),r=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},l=[],o=s(1),i={},n=(0,o.Z)(i,r,l,!1,null,null,null),c=n.exports,d=s(345),p=function(){var t=this,e=t._self._c;return e("div",[e("sidebar-component",{attrs:{formats:Object.keys(t.statistics.formats)}}),e("div",{staticClass:"relative md:ml-64 bg-gray-200"},[e("navbar-component"),e("div",{staticClass:"relative bg-blue-600 md:pt-32 pb-32 pt-12"},[e("div",{staticClass:"px-4 md:px-10 mx-auto w-full"},[e("div",[e("Cards",{attrs:{info:t.statistics.total}})],1)])]),e("div",{staticClass:"px-4 md:px-10 mx-auto w-full -m-24"},[e("div",{staticClass:"flex flex-wrap mt-4"},[e("FormatsTable")],1),e("Footer")],1)],1)],1)},f=[],u=function(){var t=this,e=t._self._c;return e("nav",{staticClass:"absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4"},[e("div",{staticClass:"w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4"},[t.brand?t._e():e("router-link",{staticClass:"text-white text-sm uppercase hidden lg:inline-block font-semibold",attrs:{to:"/"}},[t._v("Dashboard ")]),"clones"===t.brand?e("router-link",{staticClass:"text-white text-sm uppercase hidden lg:inline-block font-semibold",attrs:{to:"/clones"}},[t._v("All Clones ")]):t._e(),"format"===t.brand?e("router-link",{staticClass:"text-white text-sm uppercase hidden lg:inline-block font-semibold",attrs:{to:"/format/"+t.$route.params.format}},[t._v("Format: "+t._s(t.$route.params.format)+" ")]):t._e()],1)])},m=[],x={props:["brand"]},b=x,w=(0,o.Z)(b,u,m,!1,null,null,null),v=w.exports,h=function(){var t=this,e=t._self._c;return e("nav",{staticClass:"md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"},[e("div",{staticClass:"md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"},[e("button",{staticClass:"cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent",attrs:{type:"button"},on:{click:function(e){return t.toggleCollapseShow("bg-white m-2 py-3 px-6")}}},[e("i",{staticClass:"fas fa-bars"})]),e("router-link",{staticClass:"md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0",attrs:{to:"/"}},[e("img",{staticClass:"m-2 max-w-full h-auto align-middle border-none",attrs:{src:s(449)}})]),e("div",{staticClass:"md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded",class:t.collapseShow},[e("div",{staticClass:"md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300"},[e("div",{staticClass:"flex flex-wrap"},[e("div",{staticClass:"w-6/12"},[e("router-link",{staticClass:"md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0",attrs:{to:"/"}},[t._v(" copy/paste report ")])],1),e("div",{staticClass:"w-6/12 flex justify-end"},[e("button",{staticClass:"cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent",attrs:{type:"button"},on:{click:function(e){return t.toggleCollapseShow("hidden")}}},[e("i",{staticClass:"fas fa-times"})])])])]),e("ul",{staticClass:"md:flex-col md:min-w-full flex flex-col list-none"},[e("li",{staticClass:"inline-flex"},[e("router-link",{staticClass:"hover:text-grey-600 text-xs uppercase py-3 font-bold block",class:{"text-gray-500":!t.menuItem,"text-gray-800":t.menuItem},attrs:{to:"/"}},[e("i",{staticClass:"fas fa-tv opacity-75 mr-2 text-sm"}),t._v(" Dashboard ")])],1),e("li",{staticClass:"inline-flex"},[e("router-link",{staticClass:"text-grey-500 hover:text-grey-600 text-xs uppercase py-3 font-bold block",class:{"text-gray-500":"clones"===t.menuItem,"text-gray-800":"clones"!==t.menuItem},attrs:{to:"/clones"}},[e("i",{staticClass:"fas fa-clone opacity-75 mr-2 text-sm"}),t._v(" All clones ")])],1)]),e("hr",{staticClass:"my-4 md:min-w-full"}),e("FormatsList",{attrs:{list:t.formats,"current-format":t.currentFormat}})],1)],1)])},g=[],C=function(){var t=this,e=t._self._c;return e("div",[e("a",{ref:"btnDropdownRef",staticClass:"text-gray-600 block py-1 px-3",attrs:{href:"#pablo"},on:{click:function(e){return t.toggleDropdown(e)}}},[e("i",{staticClass:"fas fa-bell"})]),e("div",{ref:"popoverDropdownRef",staticClass:"bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1",class:{hidden:!t.dropdownPopoverShow,block:t.dropdownPopoverShow},staticStyle:{"min-width":"12rem"}},[e("a",{staticClass:"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800",attrs:{href:"#pablo"}},[t._v(" Action ")]),e("a",{staticClass:"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800",attrs:{href:"#pablo"}},[t._v(" Another action ")]),e("a",{staticClass:"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800",attrs:{href:"#pablo"}},[t._v(" Something else here ")]),e("div",{staticClass:"h-0 my-2 border border-solid border-gray-200"}),e("a",{staticClass:"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800",attrs:{href:"#pablo"}},[t._v(" Seprated link ")])])])},y=[],_={data(){return{dropdownPopoverShow:!1}},methods:{toggleDropdown:function(t){t.preventDefault(),this.dropdownPopoverShow?this.dropdownPopoverShow=!1:this.dropdownPopoverShow=!0}}},k=_,F=(0,o.Z)(k,C,y,!1,null,null,null),S=F.exports,j=function(){var t=this,e=t._self._c;return e("div",[e("a",{ref:"btnDropdownRef",staticClass:"text-gray-600 block",attrs:{href:"#pablo"},on:{click:function(e){return t.toggleDropdown(e)}}},[t._m(0)]),e("div",{ref:"popoverDropdownRef",staticClass:"bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1",class:{hidden:!t.dropdownPopoverShow,block:t.dropdownPopoverShow},staticStyle:{"min-width":"12rem"}},[e("a",{staticClass:"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800",attrs:{href:"#pablo"}},[t._v(" Action ")]),e("a",{staticClass:"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800",attrs:{href:"#pablo"}},[t._v(" Another action ")]),e("a",{staticClass:"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800",attrs:{href:"#pablo"}},[t._v(" Something else here ")]),e("div",{staticClass:"h-0 my-2 border border-solid border-gray-200"}),e("a",{staticClass:"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800",attrs:{href:"#pablo"}},[t._v(" Seprated link ")])])])},D=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"items-center flex"},[e("span",{staticClass:"w-12 h-12 text-sm text-white bg-gray-300 inline-flex items-center justify-center rounded-full"})])}],T={data(){return{dropdownPopoverShow:!1}},methods:{toggleDropdown:function(t){t.preventDefault(),this.dropdownPopoverShow?this.dropdownPopoverShow=!1:this.dropdownPopoverShow=!0}}},Z=T,P=(0,o.Z)(Z,j,D,!1,null,null,null),L=P.exports,O=function(){var t=this,e=t._self._c;return e("div",[e("h6",{staticClass:"md:min-w-full text-gray-600 text-xs uppercase font-bold block pt-1 pb-4 no-underline"},[t._v("Formats")]),t._l(Object.keys(t.statistics.formats),(function(s,a){return e("router-link",{key:a,staticClass:"text-white active:bg-blue-600 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1",class:{"bg-blue-500":s!==t.currentFormat,"bg-gray-500":s===t.currentFormat},staticStyle:{transition:"all .15s ease"},attrs:{to:"/format/"+s,type:"button"}},[t._v(" "+t._s(s)+" ")])}))],2)},A=[],$=s(629),I={data(){return{}},props:["currentFormat"],computed:(0,$.rn)({statistics:t=>t.statistics})},z=I,N=(0,o.Z)(z,O,A,!1,null,null,null),R=N.exports,E={data(){return{collapseShow:"hidden"}},props:["formats","currentFormat","menuItem"],methods:{toggleCollapseShow:function(t){this.collapseShow=t}},components:{FormatsList:R,NotificationDropdownComponent:S,UserDropdownComponent:L}},Y=E,U=(0,o.Z)(Y,h,g,!1,null,null,null),H=U.exports,M=function(){var t=this,e=t._self._c;return e("div",{staticClass:"flex flex-wrap"},[e("div",{staticClass:"w-full lg:w-6/12 xl:w-3/12 px-4"},[e("div",{staticClass:"relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"},[e("div",{staticClass:"flex-auto p-4"},[e("div",{staticClass:"flex flex-wrap"},[e("div",{staticClass:"relative w-full pr-4 max-w-full flex-grow flex-1"},[e("h5",{staticClass:"text-gray-500 uppercase font-bold text-xs"},[t._v(" Total files ")]),e("span",{staticClass:"font-semibold text-xl text-gray-800"},[t._v(t._s(t.info.sources))])]),t._m(0)]),e("p",{staticClass:"text-sm text-gray-500 mt-4"},[e("span",{staticClass:"text-green-500 mr-2"},[t._v(" "+t._s(t.info.lines)+" ")]),e("span",{staticClass:"whitespace-no-wrap"},[t._v(" Lines of of code in the files ")])])])])]),e("div",{staticClass:"w-full lg:w-6/12 xl:w-3/12 px-4"},[e("div",{staticClass:"relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"},[e("div",{staticClass:"flex-auto p-4"},[e("div",{staticClass:"flex flex-wrap"},[e("div",{staticClass:"relative w-full pr-4 max-w-full flex-grow flex-1"},[e("h5",{staticClass:"text-gray-500 uppercase font-bold text-xs"},[t._v(" Clones ")]),e("span",{staticClass:"font-semibold text-xl text-gray-800"},[t._v(" "+t._s(t.info.clones)+" ")])]),t._m(1)]),e("p",{staticClass:"text-sm text-gray-500 mt-4"},[e("span",{staticClass:"text-red-500 mr-2"},[t._v(" "+t._s(t.info.duplicatedLines)+" ("+t._s(t.info.percentage)+"%) ")]),e("span",{staticClass:"whitespace-no-wrap"},[t._v("Duplicated lines")])])])])])])},q=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"relative w-auto pl-4 flex-initial"},[e("div",{staticClass:"text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-700"},[e("i",{staticClass:"far fa-chart-bar"})])])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"relative w-auto pl-4 flex-initial"},[e("div",{staticClass:"text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-pink-700"},[e("i",{staticClass:"fas fa-chart-pie"})])])}],B={data(){return{}},props:["info"]},G=B,J=(0,o.Z)(G,M,q,!1,null,null,null),K=J.exports,Q=function(){var t=this,e=t._self._c;return e("div",{staticClass:"w-full xl:w-8/12 mb-12 xl:mb-0 px-4"},[e("div",{staticClass:"relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"},[e("div",{staticClass:"rounded-t mb-0 px-4 py-3 border-0"},[e("div",{staticClass:"flex flex-wrap items-center"},[t._m(0),e("div",{staticClass:"relative w-full font-semibold px-4 max-w-full flex-grow flex-1 text-right"},[t._v(" Total: "+t._s(Object.keys(t.statistics.formats).length)+" ")])])]),e("div",{staticClass:"block w-full overflow-x-auto"},[e("table",{staticClass:"items-center w-full bg-transparent border-collapse"},[t._m(1),e("tbody",t._l(Object.keys(t.statistics.formats),(function(s,a){return e("tr",{key:a},[e("th",{staticClass:"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[e("router-link",{staticClass:"font-semibold",attrs:{to:"/format/"+s}},[t._v(t._s(s))])],1),e("td",{staticClass:"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[t._v(" "+t._s(t.statistics.formats[s].total.sources)+" ")]),e("td",{staticClass:"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[t._v(" "+t._s(t.statistics.formats[s].total.lines)+" ")]),e("td",{staticClass:"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[t._v(" "+t._s(t.statistics.formats[s].total.clones)+" ")]),e("td",{staticClass:"border-t-0 font-semibold px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[t._v(" "+t._s(t.statistics.formats[s].total.duplicatedLines)+" ("),e("b",[t._v(t._s(t.statistics.formats[s].total.percentage)+"%")]),t._v(") ")]),e("td",{staticClass:"border-t-0 font-semibold px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[t._v(" "+t._s(t.statistics.formats[s].total.duplicatedTokens)+" ("),e("b",[t._v(t._s(t.statistics.formats[s].total.percentageTokens)+"%")]),t._v(") ")])])})),0)])])])])},V=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"relative w-full px-4 max-w-full flex-grow flex-1"},[e("h3",{staticClass:"font-semibold text-base text-gray-800"},[t._v(" Formats ")])])},function(){var t=this,e=t._self._c;return e("thead",[e("tr",[e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"}),e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"},[t._v(" Files ")]),e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"},[t._v(" Lines ")]),e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"},[t._v(" Clones ")]),e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"},[t._v(" Duplicated lines ")]),e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"},[t._v(" Duplicated tokens ")])])])}],W={data(){return{}},methods:(0,$.nv)(["setCurrentFormat"]),computed:(0,$.rn)({statistics:t=>t.statistics})},X=W,tt=(0,o.Z)(X,Q,V,!1,null,null,null),et=tt.exports,st=function(){var t=this;t._self._c;return t._m(0)},at=[function(){var t=this,e=t._self._c;return e("footer",{staticClass:"block py-4"},[e("div",{staticClass:"container mx-auto px-4"},[e("hr",{staticClass:"mb-4 border-b-1 border-gray-300"}),e("div",{staticClass:"flex flex-wrap items-center md:justify-between justify-center"},[e("div",{staticClass:"w-full md:w-4/12 px-4"},[e("div",{staticClass:"text-sm text-gray-600 font-semibold py-1"},[t._v(" The report generated with "),e("a",{staticClass:"text-gray-600 hover:text-gray-800 text-sm font-semibold py-1",attrs:{href:"https://github.com/kucherenko/jscpd"}},[t._v(" jscpd ")])])]),e("div",{staticClass:"w-full md:w-8/12 px-4"},[e("ul",{staticClass:"flex flex-wrap list-none md:justify-end justify-center"},[e("li",[e("a",{staticClass:"text-gray-700 hover:text-gray-900 text-sm font-semibold block py-1 px-3",attrs:{href:"https://github.com/kucherenko/jscpd"}},[t._v(" jscpd - copy/paste detector ")])]),e("li",[e("a",{staticClass:"text-gray-700 hover:text-gray-900 text-sm font-semibold block py-1 px-3",attrs:{href:"https://github.com/kucherenko/jscpd/blob/master/LICENSE"}},[t._v(" MIT License ")])])])])])])])}],rt={components:{UserDropdownComponent:L}},lt=rt,ot=(0,o.Z)(lt,st,at,!1,null,null,null),it=ot.exports,nt={name:"dashboard-page",components:{Footer:it,NavbarComponent:v,SidebarComponent:H,Cards:K,FormatsTable:et},data(){return{date:(new Date).getFullYear()}},computed:(0,$.rn)({duplicates:t=>t.duplicates,statistics:t=>t.statistics,currentFormat:t=>t.currentFormat})},ct=nt,dt=(0,o.Z)(ct,p,f,!1,null,null,null),pt=dt.exports,ft=function(){var t=this,e=t._self._c;return e("div",[e("sidebar-component",{attrs:{"menu-item":"format","current-format":t.$route.params.format}}),e("div",{staticClass:"relative md:ml-64 bg-gray-200"},[e("navbar-component",{attrs:{brand:"format"}}),e("div",{staticClass:"relative bg-blue-600 md:pt-32 pb-32 pt-12"},[e("div",{staticClass:"px-4 md:px-10 mx-auto w-full"},[e("div",[e("Cards",{attrs:{info:t.statistics.formats[t.$route.params.format].total}})],1),e("div",{staticClass:"w-full lg:w-6/12 xl:w-3/12 px-4"},[e("ul",{staticClass:"flex"},[e("li",{staticClass:"-mb-px mr-1"},[e("a",{staticClass:"inline-block rounded-t py-2 px-4 font-semibold",class:{"text-blue-200":"clones"!==t.activeTab,"border-b-2 text-white":"clones"===t.activeTab},on:{click:function(e){t.activeTab="clones"}}},[t._v("Clones ")])]),e("li",{staticClass:"mr-1"},[e("a",{staticClass:"inline-block py-2 px-4 hover:text-blue-200 font-semibold",class:{"text-blue-200":"files"!==t.activeTab,"border-b-2 text-white":"files"===t.activeTab},on:{click:function(e){t.activeTab="files"}}},[t._v("Files ")])])])])])]),e("div",{staticClass:"px-4 md:px-10 mx-auto w-full -m-24"},[e("div",{staticClass:"flex flex-wrap mt-4"},["clones"===t.activeTab?e("Clones",{attrs:{list:t.duplicates.filter((e=>e.format===t.$route.params.format))}}):t._e(),"files"===t.activeTab?e("SourcesTable",{attrs:{sources:t.statistics.formats[t.$route.params.format].sources}}):t._e()],1),e("Footer")],1)],1)],1)},ut=[],mt=function(){var t=this,e=t._self._c;return e("div",{staticClass:"w-full xl:w-8/12 mb-12 xl:mb-0 px-4"},t._l(t.list,(function(t,s){return e("div",{key:s,staticClass:"relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"},[e("Clone",{attrs:{clone:t}})],1)})),0)},xt=[],bt=function(){var t=this,e=t._self._c;return e("div",[e("div",{staticClass:"md:flex"},[e("div",{staticClass:"mt-4 md:mt-0 md:ml-6 p-5"},[e("div",{staticClass:"uppercase tracking-wide text-left text-sm text-indigo-600 font-bold"},[t._v(t._s(t.clone.format))]),e("p",{staticClass:"mt-2 text-gray-800 text-left"},[t._v(" "+t._s(t.clone.firstFile.name)+" "),e("span",{staticClass:"text-gray-600"},[t._v("("+t._s(t.clone.firstFile.startLoc.line)+":"+t._s(t.clone.firstFile.startLoc.column)+"-"+t._s(t.clone.firstFile.endLoc.line)+":"+t._s(t.clone.firstFile.endLoc.column)+")")])]),e("p",{staticClass:"mt-2 text-gray-800 text-left"},[t._v(" "+t._s(t.clone.secondFile.name)+" "),e("span",{staticClass:"text-gray-600"},[t._v("("+t._s(t.clone.secondFile.startLoc.line)+":"+t._s(t.clone.secondFile.startLoc.column)+"-"+t._s(t.clone.secondFile.endLoc.line)+":"+t._s(t.clone.secondFile.endLoc.column)+")")])])])]),e("div",{staticClass:"text-center"},[t.isActive?t._e():e("button",{staticClass:"text-grey-200 text-sm",on:{click:function(e){return t.toggleCode()}}},[t._v(" Show code ")]),t.isActive?e("button",{staticClass:"text-grey-200 text-sm",on:{click:function(e){return t.toggleCode()}}},[t._v(" Hide code ")]):t._e()]),t.isActive?e("div",[e("pre",{staticClass:"text-left bg-gray-100 p-5 text-sm overflow-scroll"},[e("code",[t._v(t._s(t.clone.fragment))])])]):t._e()])},wt=[],vt={data(){return{isActive:!1}},methods:{toggleCode(){this.isActive=!this.isActive}},components:{},props:["clone"]},ht=vt,gt=(0,o.Z)(ht,bt,wt,!1,null,null,null),Ct=gt.exports,yt={components:{Clone:Ct},props:["list"]},_t=yt,kt=(0,o.Z)(_t,mt,xt,!1,null,null,null),Ft=kt.exports,St=function(){var t=this,e=t._self._c;return e("div",{staticClass:"w-full xl:w-8/12 mb-12 xl:mb-0 px-4"},[e("div",{staticClass:"relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"},[e("div",{staticClass:"rounded-t mb-0 px-4 py-3 border-0"},[e("div",{staticClass:"flex flex-wrap items-center"},[t._m(0),e("div",{staticClass:"relative w-full font-semibold px-4 max-w-full flex-grow flex-1 text-right"},[t._v(" Total: "+t._s(Object.keys(t.sources).length)+" ")])])]),e("div",{staticClass:"block w-full overflow-x-auto"},[e("table",{staticClass:"items-center w-full bg-transparent border-collapse"},[t._m(1),e("tbody",t._l(Object.keys(t.sources),(function(s,a){return e("tr",{key:a},[e("th",{staticClass:"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[t._v(" "+t._s(s)+" ")]),e("td",{staticClass:"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[t._v(" "+t._s(t.sources[s].lines)+" ")]),e("td",{staticClass:"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"},[t._v(" "+t._s(t.sources[s].duplicatedLines)+" ")])])})),0)])])])])},jt=[function(){var t=this,e=t._self._c;return e("div",{staticClass:"relative w-full px-4 max-w-full flex-grow flex-1"},[e("h3",{staticClass:"font-semibold text-base text-gray-800"},[t._v(" Files ")])])},function(){var t=this,e=t._self._c;return e("thead",[e("tr",[e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"}),e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"},[t._v(" Lines ")]),e("th",{staticClass:"px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"},[t._v(" Duplicated lines ")])])])}],Dt={data(){return{}},props:["sources"]},Tt=Dt,Zt=(0,o.Z)(Tt,St,jt,!1,null,null,null),Pt=Zt.exports,Lt={name:"dashboard-page",components:{Clones:Ft,Footer:it,NavbarComponent:v,SidebarComponent:H,Cards:K,SourcesTable:Pt},data(){return{date:(new Date).getFullYear(),activeTab:"clones"}},computed:(0,$.rn)({duplicates:t=>t.duplicates,statistics:t=>t.statistics,currentFormat:t=>t.currentFormat})},Ot=Lt,At=(0,o.Z)(Ot,ft,ut,!1,null,null,null),$t=At.exports,It=function(){var t=this,e=t._self._c;return e("div",[e("sidebar-component",{attrs:{"menu-item":"clones"}}),e("div",{staticClass:"relative md:ml-64 bg-gray-200"},[e("navbar-component",{attrs:{brand:"clones"}}),e("div",{staticClass:"relative bg-blue-600 md:pt-32 pb-32 pt-12"},[e("div",{staticClass:"px-4 md:px-10 mx-auto w-full"},[e("div",[e("Cards",{attrs:{info:t.statistics.total}})],1)])]),e("div",{staticClass:"px-4 md:px-10 mx-auto w-full -m-24"},[e("div",{staticClass:"flex flex-wrap mt-4"},[e("Clones",{attrs:{list:t.duplicates}})],1),e("Footer")],1)],1)],1)},zt=[],Nt={name:"dashboard-page",components:{Clones:Ft,Footer:it,NavbarComponent:v,SidebarComponent:H,Cards:K,FormatsTable:et},data(){return{date:(new Date).getFullYear()}},computed:(0,$.rn)({duplicates:t=>t.duplicates,statistics:t=>t.statistics,currentFormat:t=>t.currentFormat})},Rt=Nt,Et=(0,o.Z)(Rt,It,zt,!1,null,null,null),Yt=Et.exports;a.ZP.use(d.Z);var Ut=[{path:"/",name:"Dashboard",component:pt},{path:"/clones",name:"Clones",component:Yt},{path:"/format/:format",name:"Format",component:$t}],Ht=new d.Z({base:"",routes:Ut}),Mt=Ht,qt=s(655),Bt=window.initialData||{statistics:{detectionDate:"",formats:{},total:{}},duplicates:[]};a.ZP.use($.ZP);var Gt=new $.ZP.Store({state:(0,qt.pi)({},Bt),mutations:{init:function(t,e){t.statistics=e.statistics,t.duplicates=e.duplicates},setDuplicates:function(t,e){t.duplicates=e},setStatistics:function(t,e){t.statistics=e}},actions:{initData:function(t){var e=t.commit;fetch("jscpd-report.json").then((function(t){return t.json()})).then((function(t){e("init",t)}))}},modules:{}});a.ZP.config.productionTip=!1,new a.ZP({router:Mt,store:Gt,render:function(t){return t(c)},created:function(){this.$store.dispatch("initData")}}).$mount("#app")},449:function(t,e,s){t.exports=s.p+"img/logo-small-box.5ddb19ec.svg"}},e={};function s(a){var r=e[a];if(void 0!==r)return r.exports;var l=e[a]={exports:{}};return t[a](l,l.exports,s),l.exports}s.m=t,function(){var t=[];s.O=function(e,a,r,l){if(!a){var o=1/0;for(d=0;d<t.length;d++){a=t[d][0],r=t[d][1],l=t[d][2];for(var i=!0,n=0;n<a.length;n++)(!1&l||o>=l)&&Object.keys(s.O).every((function(t){return s.O[t](a[n])}))?a.splice(n--,1):(i=!1,l<o&&(o=l));if(i){t.splice(d--,1);var c=r();void 0!==c&&(e=c)}}return e}l=l||0;for(var d=t.length;d>0&&t[d-1][2]>l;d--)t[d]=t[d-1];t[d]=[a,r,l]}}(),function(){s.d=function(t,e){for(var a in e)s.o(e,a)&&!s.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})}}(),function(){s.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){s.p=""}(),function(){var t={143:0};s.O.j=function(e){return 0===t[e]};var e=function(e,a){var r,l,o=a[0],i=a[1],n=a[2],c=0;if(o.some((function(e){return 0!==t[e]}))){for(r in i)s.o(i,r)&&(s.m[r]=i[r]);if(n)var d=n(s)}for(e&&e(a);c<o.length;c++)l=o[c],s.o(t,l)&&t[l]&&t[l][0](),t[l]=0;return s.O(d)},a=self["webpackChunkmockups"]=self["webpackChunkmockups"]||[];a.forEach(e.bind(null,0)),a.push=e.bind(null,a.push.bind(a))}();var a=s.O(void 0,[998],(function(){return s(718)}));a=s.O(a)})();
//# sourceMappingURL=app.4a4d284c.js.map