function uploaded(event){
    const file = event.target.files[0];

    if (file){
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            const split_by_sync = fileContent.split("싱크로 레벨: ");
            const union_mem_size = split_by_sync.length - 1;
            const infos = [];
            let step;
            for(step = 0; step<union_mem_size; step++){
                let name;
                { //Guess name
                    let parse1 = split_by_sync[step].toString().split("</div>");
                    let parse2 = parse1[parse1.length - 2].split("font-medium\">");
                    name = parse2[parse2.length - 1];
                }
                let level;
                { // Guess level
                    let parse1 = split_by_sync[step + 1].toString().split("</span>");
                    level = parseInt(parse1[0]);
                }
                let damage
                let damage_str;
                let search_target = "--fill-5)]\">" + name;
                if (fileContent.includes(search_target)){
                    damage_str = fileContent.split(search_target)[1].split("<span>")[1].split("</span>")[0];
                }
                else{
                    damage_str = "0";
                }
                damage = parse_damage(damage_str);

                document.getElementById("result").rows[step + 1].cells[0].innerText = name;
                document.getElementById("result").rows[step + 1].cells[1].innerText = level;
                document.getElementById("result").rows[step + 1].cells[2].innerText = damage_str;
                document.getElementById("result").rows[step + 1].cells[3].innerText = damage;
                

                infos.push([name, level, damage_str, damage]);
            } 
            downloadFile(infos);
        }
        reader.readAsText(file);
    }
}

function parse_damage(damage){
    const billion = 1000000000;
    const million = 1000000;
    if (damage[damage.length - 1] == "B"){
        return parseInt(parseFloat(damage.substring(0,damage.length - 1)) * billion);
    }
    else if (damage[damage.length - 1] == "M"){
        return parseInt(parseFloat(damage.substring(0,damage.length - 1)) * million);
    }
    else if (!isNaN(damage[damage.length - 1]))
    {
        return parseInt(damage);
    }
    else{
        alert(damage + "은(는) 모르는 값 표시임. 지금 xxxB표시만 지원함 제보 부탁함");
        return 0;
    }
}

 function downloadFile(arr) {

    let content = "이름,레밸,총 대미지, 총 대미지(환산)\n";
    let step = 0;
    for(step = 0; step < arr.length; step++){
        let ele = arr[step];
        let name = ele[0].replace("\"", "\\\"");
        let level = ele[1];
        let damage_str = ele[2].replace("\"", "\\\"");
        let damage = ele[3];
        content += "\""+ name + "\"," + level + ",\"" +damage_str + "\"," + damage + "\n";
    }

    const blob = new Blob([content], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'result.csv';  
    link.click();
    URL.revokeObjectURL(url);

}


