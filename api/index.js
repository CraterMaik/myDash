const { getUser } = require("./utils/get.js");

async function y(){
let crater = await getUser("253727823972401153");
console.log(crater);
}
y();