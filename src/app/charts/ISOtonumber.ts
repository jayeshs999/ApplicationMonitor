export function convertToNumbers(series){
    return series.map((ele)=>{
        return {
            name : ele.name, 
            data: ele.data.map((e)=>{
                return {
                    x: Date.parse(e.x),
                    y:e.y
                }
            })
        }
    })
}