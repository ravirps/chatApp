const generatemessage=function(text){
    return {
        "text":text,
        "created_at":new Date().getTime()
    }
}
module.exports=generatemessage