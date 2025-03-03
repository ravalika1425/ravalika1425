export function getRandomInt(min:number, max:number) {
    min = Math.ceil(min); // Ensure the minimum is rounded up to the nearest whole number
    max = Math.floor(max); // Ensure the maximum is rounded down to the nearest whole number
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function getFirstNameFromEmail(email: string) {
    // Split the email address at the '@' character to separate the local part from the domain
    let localPart = email.split('@')[0];
    
    // Split the local part at the '.' character to separate the first name from the last name
    let firstName = localPart.split('.')[0];
    
    // Return the first name
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}

export function getDate(){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const date = new Date();
const day = date.getDate();
const month = months[date.getMonth()];
const year = date.getFullYear();
return `${day} ${month}, ${year}`
}

export function isObjectEmpty(obj: object):boolean {
    return Object.keys(obj).length === 0;
}