const allPostDates = document.querySelectorAll('.post-date')

for(date of allPostDates){
    
    let data = date.innerText.split('-')
    let newDate = [data[2], data[1], data[0]]
    date.innerText = newDate.join('-')
    
}