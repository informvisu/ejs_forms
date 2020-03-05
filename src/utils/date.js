class date {
	
	constructor(dt) {
		if(dt==null)
			this.dt = new Date()
		else
			this.dt = dt
		
		this.toText()
	}
	
	setDate(dt) {
		this.dt = dt
		this.toText()
	}
	
	getDate() {
		return this.dt
	}
	
	getFormatted(dtFmt) {
		if(dtFmt === 'yyyymmddhhMMssSSS') {
			return this.yyyy+this.mm+this.dd+this.hh+this.MM+this.ss+this.SSS			
		} else if(dtFmt === 'yyyymmddhhMMss') {
			return this.yyyy+this.mm+this.dd+this.hh+this.MM+this.ss			
		} else if(dtFmt === 'yyyymmdd') {
			return this.yyyy+this.mm+this.dd
		} else {
			return this.dt.getTime()
		}
	}
	
	toText() {
		this.yyyy = this.dt.getFullYear()
		this.mm = this.dt.getMonth() + 1
		this.dd = this.dt.getDate()
		this.hh = this.dt.getHours()
		this.MM = this.dt.getMinutes()
		this.ss = this.dt.getSeconds()
		this.SSS = this.dt.getMilliseconds()
		
		if (this.mm < 10) this.mm = '0' + this.mm
		if (this.dd < 10) this.dd = '0' + this.dd
		if (this.hh < 10) this.hh = '0' + this.hh
		if (this.MM < 10) this.MM = '0' + this.MM
		if (this.ss < 10) this.ss = '0' + this.ss
		if (this.SSS < 10) this.SSS = '00' + this.SSS
		else if(this.SSS < 100) this.SSS = '0' + this.SSS
	}
}

module.exports = date;
