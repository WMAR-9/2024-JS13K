class genCode{
    array2String(arr, color_bit = 4) {
        let result = "", temp = 0, count = 0;
        const max_bits = 18; 
        const bit_size = max_bits / color_bit; 
    
        arr.forEach((e, i) => {

            temp += (e << (color_bit * count));
            count++;
    
            if (count >= bit_size) {
                result += String.fromCodePoint(temp);
                temp = 0;
                count = 0;
            }
        });

        if (count > 0) {
            result += String.fromCodePoint(temp);
        }
    
        return result;
    }
    array2Zero(arr,length){
        let result = "["
        arr.forEach((e,i)=>{
            //result+=e?i!=arr.length-1?`${e},`:"":i!=arr.length-1?",":""
            let temp =""
            if(e!=length){
                if(i!==arr.length-1){
                    temp=`${e},`
                }else{
                    temp=`${e}`
                }
            }else{
                if(i!==arr.length-1){
                    temp=`,`
                }
            }
            result += temp
        })
        result+="]"
        return result
    }
    array2ZipString(arr){
        let tempChar = arr.concat().shift(),count=0
        let result="",i
        for(i=1;i<arr.length;i++){
            if(tempChar===arr[i]){
                count += 1
            }else{
                result +=(count||"")+String.fromCodePoint(+tempChar)
                count = 0
                tempChar = arr[i]
            }
        }
        result += (count||"")+String.fromCodePoint(+tempChar)
        return result
    }
}

class deCode{
    string2Array(str, color_bit = 4, originalLength = 121) {
        let result = [];
        const color_space = (1 << color_bit) - 1;
        const max_bits = 18;
        const bit_size = max_bits / color_bit;
    
        [...str].forEach((char) => {
            let temp = char.codePointAt(0);
    
            for (let i = 0; i < bit_size; i++) {
                result.push(temp & color_space);
                temp >>= color_bit;
            }
        });

        if (result.length > originalLength) {
            result = result.slice(0, originalLength);
        }
    
        return result;
    }
    zipString2Array(str){
        let temp = str.split(/(\D)/).map((v,i,e)=>+v?e[i+1].repeat(v):v).join("");
        return [...temp].map(e=>e.codePointAt(0))
    }
    zeroArray2Code(str){
        return str.replace(/\[|\]|/g,"").split(',')
    }
}
const t = [
    [8, 8, 8, 8, 5, 8, 8, 8, 8, 8, 5, 8, 8, 8, 8, 1],
    [8, 8, 8, 8, 8, 8, 8, 5, 8, 8, 8, 8, 8, 5, 5, 0],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 8, 8, 4],
    [8, 8, 8, 8, 8, 5, 8, 8, 8, 5, 8, 8, 8, 4, 4, 8],
    [5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3, 7, 6, 2, 6],
    [7, 7, 7, 7, 7, 7, 3, 7, 7, 7, 3, 6, 7, 2, 4, 2],
    [7, 6, 7, 7, 7, 7, 6, 3, 7, 7, 6, 6, 7, 6, 2, 6],
    [6, 7, 6, 7, 7, 7, 7, 6, 7, 7, 7, 7, 6, 7, 7, 7]
];
const arr2D21D = (t,blockSize)=>{
    const blocks = [];

    for (let row = 0; row < t.length; row += blockSize) {
        for (let col = 0; col < t[0].length; col += blockSize) {
            const block = [];
            for (let i = row; i < row + blockSize; i++) {
                block.push(...t[i].slice(col, col + blockSize));
            }
            blocks.push(block);
        }
    }

    console.log("block > ",blocks);
    return blocks
}
/**
 * 
    How to use
    const gen = new genCode()
    const de = new deCode()
    const blocksize = 16
    const bitsize = 4
    const n = colorPalette.length
    value.forEach(e=>{
       e.forEach((k,i)=>{
           if(!k&&k!=0){
              e[i] = n
           }
       })
    })
    const a = arr2D21D (value,blocksize)
    const row = []
    a.forEach(e=>{
        row.push(gen.array2String(e,bitsize))
    }) 
    row.forEach(e=>{
        console.log(de.string2Array(e,bitsize))
    })
 */