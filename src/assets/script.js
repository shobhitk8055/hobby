// function checkQuery(search){
//     const params = new URLSearchParams(search);
//     const name = params.get("name");
//     if(!name){
//         location.href= '/';
//     }
//     return name;
// }

// const loc = window.location;
// if(loc.pathname === "/app/create-hobby"){
//     const name = checkQuery(loc.search);

// }
// if(loc.pathname === "/app/dashboard"){
//     const name = checkQuery(loc.search);
//     $('#create-btn').attr('href', `/app/create-hobby?name=${name}`)
// }