class check {
    day;
    check;
    constructor(day, check) {
        this.day = day;
        this.check = check;
        this.day.setHours(0,0,0,0);
    }

    status(dayC) {
        this.day.setHours(0,0,0,0);
        if (this.day.getTime() === dayC.getTime()) {
            if (check)
                return false;
            else
                return true;
        } else {
            return false;
        }
    }
}