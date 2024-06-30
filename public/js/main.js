
const p_day = document.getElementById('day');
const p_date = document.getElementById('date');

const submitbtn = document.getElementById('submit');
const city = document.getElementById('cityname');
const temp_h = document.getElementById('temp-here');

const temp = document.getElementById('temp');


const temperature = document.getElementById('temperature');
const area = document.getElementById('area');

const temp_status = document.getElementById('temp_status');

// "http://api.openweathermap.org/data/2.5/weather?q=Lahore&units=metric&appid=1649970884e9d8fb0691b82d5edaecce"


const getcurrentday = () => {
    const currentdate = new Date();
    let days = ['Mon','Tue','Wed','Thur','Fri','Sat','Sun'];
    let months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let cur_day =days[currentdate.getDay()-1];

    let cur_date = currentdate.getDate();

    let month = months[currentdate.getMonth()];

    p_day.innerHTML= cur_day;
    p_date.innerHTML= `${cur_date} ${month}`;

}

const getInfo = async(event) => {
    event.preventDefault();
    let cityVal = city.value;
    let empty = 'enter value';

    if(cityVal === ""){
        temp_h.innerHTML = empty;
    }
    else{
        try{
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=1649970884e9d8fb0691b82d5edaecce`;
            const response = await fetch(url);
            const data = await response.json();
            const arrdata = [data];
         temperature.style.visibility="visible";
            area.style.visibility="visible";
            temp_h.style.visibility="hidden";
            temp.innerHTML = `${arrdata[0].main.temp}°C`;
            area.innerHTML = `${arrdata[0].name},${arrdata[0].sys.country}`;

            const temp_mood = arrdata[0].weather[0].main;

            if(temp_mood === "Clear"){
                temp_status.innerHTML = "<i class='fa-solid fa-sun' style='color: #eccc68;'></i>";
            }
            else if(temp_mood === "Clouds"){
                temp_status.innerHTML = "<i class='fa-solid fa-cloud' style='#f1f2f6;'></i>";
            }
            else if(temp_mood === "Rain"){
                temp_status.innerHTML = "<i class='fa-solid fa-cloud-rain' style='#a4b0be;'></i>";
            }
            else if(temp_mood === "Windy"){
                temp_status.innerHTML = "<i class='fa-solid fa-wind' style='#a4b0be;'></i>";
            }
            else if(temp_mood === "Storm"){
                temp_status.innerHTML = "<i class='fa-solid fa-poo-storm' style='#a4b0be;'></i>";
            }
            else if(temp_mood === "Fog"){
                temp_status.innerHTML = "<i class='fa-solid fa-cloud-fog' style='#a4b0be;'></i>";
            }
            
            else{
                temp_status.innerHTML = "<i class='fa-solid fa-question' style='#f1f2f6'></i>";
            }
            

            
            // vis_2.innerHTML = cityVal;
            console.log(data);
        }
        catch{
            temp_h.innerHTML = empty;
        }


    }
}

getcurrentday();

submitbtn.addEventListener('click',getInfo);





