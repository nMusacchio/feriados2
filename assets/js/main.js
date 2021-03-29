const getNextHoliday = (holidays, actual_month, actual_day) =>{
    let index = 0;
    for(holiday of holidays){
        if(holiday.mes < actual_month ||
        (holiday.mes == actual_month && holiday.dia <= actual_day)){
            index++;
            continue;
        }
            
        return index;
    }
}

const computeRemainingDays = (holiday, month, day, year) =>{
    let days_remaining = 0;
    let m = month;
    while(m < holiday.mes){
        if(m == month)
            days_remaining += new Date(year, m, 0).getDate() - day;
        else
            days_remaining += new Date(year, m, 0).getDate()
        m++;
    }
    return days_remaining + holiday.dia
}

const changeInfo = (next_holiday, date, actual_year) => {
    $(".name span").html(next_holiday.motivo);
    let days_remaining = computeRemainingDays(next_holiday, date.getMonth() + 1, date.getDate(), actual_year)
    $(".number").html(days_remaining);
    $(".date span").html(`${next_holiday.dia}/${next_holiday.mes}/${actual_year}`);
}

$(document).ready(function() {
    let date = new Date();
    let actual_year = date.getFullYear();
    let next_holiday_index;
    let first_holiday_index;
    let holidays;
    $.getJSON(`http://nolaborables.com.ar/api/v2/feriados/${actual_year}`, (data) => {
        holidays = data;
        next_holiday_index = getNextHoliday(holidays, date.getMonth() + 1, date.getDate());
        first_holiday_index = next_holiday_index;
        changeInfo(holidays[next_holiday_index], date, actual_year);
    }).fail(function(){
        console.log("error");
    })

    $(".theme-selector").click(function(){
        $("body").toggleClass("dark");
        $(".trigger i").toggleClass("fas far");
    })

    $(".next").click(function(){
        if(next_holiday_index == first_holiday_index)
            $(".prev").html(`<i class="fas fa-chevron-left"></i>`)

        if(next_holiday_index == holidays.length - 2)
            $(".next").html(``)
        changeInfo(holidays[++next_holiday_index], date, actual_year);
    });

    $(".prev").click(function(){
        if(next_holiday_index == first_holiday_index)
            return;
        if(next_holiday_index == first_holiday_index + 1){
            $(".prev").html(``)
        }
        if(next_holiday_index == holidays.length - 1)
            $(".next").html(`<i class="fas fa-chevron-right"></i>`)

        changeInfo(holidays[--next_holiday_index], date, actual_year);
    })

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        $("body").addClass("dark")
    }
});