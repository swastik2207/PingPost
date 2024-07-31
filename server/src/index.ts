import { initServer } from "./app";

async function init(){
    const app=await initServer();
   // app.use(cors())
    app.listen(8000,()=>{
        console.log("server started at port 8000")
    })
    
}
init()