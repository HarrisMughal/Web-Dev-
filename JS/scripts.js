//waits for full page to load before running
document.addEventListener("DOMContentLoaded", function() 
{
    const checkButton = document.getElementById('check')
    //liosetning for butten click
    checkButton.addEventListener('click', function() 
    {
        //gets the entered value
        const card = document.getElementById("card").value
        //outline criteria the card numb must follow, eg 16 long and starts between 51 and 55
        const cardPattern = /^5[1-5][0-9]{14}$/
        //card validation
        if (!cardPattern.test(card)) 
        {
            alert('Card must be 16 digits long AND start with 51, 52, 53, 54, or 55')
            return
        }
        //gets entred month and year values
        const month = document.getElementById('monthSelecter').value
        const year = document.getElementById('yearSelecter').value
        //checking if they added anythinbg
        if (!month || !year) 
        {
            alert("Please select month and year.")
            return
        }
        // checks to see if date is expired or not
        const now = new Date()
        if ((year < now.getFullYear()) || (year == now.getFullYear() && month < (now.getMonth() + 1))) 
        {
            alert("Card expired")
            return
        
        }
        //gets entered cvv
        const cvv = document.getElementById('cvv').value
        //cvv requirments
        const cvvPattern = /^\d{3,4}$/
        //checking to see if cvv follows the requirments
        if (!cvv.match(cvvPattern)) 
        {
            alert('CVV must be 3 or 4 digits')
            return
        }
        //api url
        const url = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard"
        //formating data to be sent to api
        const data = 
        {
            "master_card": card,
            "exp_year": parseInt(year),
            "exp_month": parseInt(month),
            "cvv_code": cvv
        }
        //send data to api to be validated
        fetch(url, 
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        )
        .then(response => {
            //if successful
            if (response.status == 200) 
            {
                return response.json()
            }
            //if api rejects
            else if (response.status == 400) 
            {
                alert ("Could not verify card")
            }
            //other error
            else 
            {
                alert ("ERROR")
            }
        }
        )
        .then(() => 
        {
            //takes the last 4 digits and stores it
            const last4 = "************" + card.slice(-4)
            localStorage.setItem("last4", last4)
            //redirects to the success page
            window.location.href = "success.html"
        }
        )
        .catch(error => {
            alert(error)
        }
        )
    }
    )
}
)
//checking path
if (window.location.pathname.includes("success.html")) {
    document.addEventListener("DOMContentLoaded", function() {
        const last4 = localStorage.getItem("last4")  
        if (last4) {
            //displays last 4 digits
            document.getElementById("displayCard").textContent += " " + last4
        } else {
            document.getElementById("displayCard").textContent += " No card found."
        }
    })
}
