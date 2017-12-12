class VinCode {
    constructor() {
        this.validate = false
        this.code = null
        this.date = []
        this.results = ''
        this.events()
        this.disableBtn()
        if (localStorage.getItem('data')) 
            this.date = JSON.parse(localStorage.getItem("data"))
    }
    events() {
        document.querySelector('form').addEventListener('submit', event => {
            event.preventDefault()
            this.onSubmit()
        })
        document.querySelector('#vinInput').addEventListener('input', event => {
            this.onInput(event)
        })
        window.addEventListener("offline", function(e) {
            alert('Интернет отключен, данные только из кеша!')
        })
        window.addEventListener("online", function(e) {
            alert("Мы в сети!!! )")
        })
    }
    sortTable(n){
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.querySelector('#table')
        switching = true;
        dir = "asc"; 
        while (switching) {
          switching = false;
          rows = table.getElementsByTagName("TR");
          for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch= true;
                break;
              }
            } else if (dir == "desc") {
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                shouldSwitch= true;
                break;
              }
            }
          }
          if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++; 
          } else {
            if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
            }
          }
        }
    }
    saveToLS() {
        let el = {
            id: this.code,
            array: this.results
        }
        this.date.push(el)
        localStorage.setItem('data', JSON.stringify(this.date))
    }
    onInput(event) {
        this.code = event.target.value
        this.validate = this.validateVin(event.target.value)
        this.disableBtn()
    }
    onSubmit() {
        let isInLS = false
        for (let i = 0; i < this.date.length; i++) {
            if (this.date[i].id == this.code){
                isInLS = true
                this.results = this.date[i].array
                this.showInTable(this.date[i].array)
            }
               
        }
        if (!isInLS) {
            fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/${this.code}?format=json`)
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    this.results = response.Results
                    this.showInTable(response.Results)
                    this.saveToLS()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
    disableBtn() {
        document.querySelector("#vinSubmit").disabled = !this.validate
    }
    showInTable(response) {
        [].forEach.call(document.querySelectorAll('.car'), function (e) {
            e.parentNode.removeChild(e);
        })
        let table = document.querySelector("table")
        for (let i = 0; i < response.length; i++) {
            var tr = document.createElement("tr")
            tr.classList = 'car'
            tr.innerHTML = `<td>${response[i].Variable}</td><td>${response[i].Value ? response[i].Value : 'данных нет'}</td>`
            table.appendChild(tr)
        }
    }
    validateVin(vin) {
        return validate(vin)
        function transliterate(c) {
            return '0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ'.indexOf(c) % 10
        }
        function get_check_digit(vin) {
            var map = '0123456789X'
            var weights = '8765432X098765432'
            var sum = 0;
            for (var i = 0; i < 17; ++i)
                sum += transliterate(vin[i]) * map.indexOf(weights[i])
            return map[sum % 11]
        }
        function validate(vin) {
            if (vin.length !== 17) return false
            return get_check_digit(vin) === vin[8]
        }
    }

}

let vin = new VinCode()


