const allPostDates = document.querySelectorAll('.post-date')

for(date of allPostDates){
    date.innerText = date.innerText.slice(0, date.innerText.indexOf('GMT'))
}