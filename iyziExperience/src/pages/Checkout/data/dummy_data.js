import {fakerTR as faker} from '@faker-js/faker'
import {lowerCase} from "lodash";

let fakeName = faker.person.firstName()
let fakeLastName = faker.person.lastName()
let fakeEmail = faker.internet.email({
    firstName: lowerCase(fakeName),
    lastName: lowerCase(fakeLastName),
    provider: 'iyzico.com',
    allowSpecialCharacters: false
})
let fakePhone = faker.helpers.fromRegExp("+905[0-9]{2}[0-9]{3}[0-9]{2}[0-9]{2}");

let fakeCountry = "Türkiye"
let fakeAddress = faker.location.streetAddress()
let fakeCity = faker.location.city()
let fakeZip = faker.location.zipCode()

let fakeCardNumber = chooseFaceCardNumber()
let fakeCardExpiration = generateFakeCardExpiration()
let fakeCardCvv = faker.finance.creditCardCVV()

const BillingData = {
    firstName: fakeName,
    lastName: fakeLastName,
    email: fakeEmail,
    phone: fakePhone
}

const AddressData = {
    address: fakeAddress,
    city: fakeCity,
    country: fakeCountry,
    zip: fakeZip
}

const CreditCardData = {
    fullName: fakeName + " " + fakeLastName,
    cardNumber: fakeCardNumber,
    expiration: fakeCardExpiration,
    cvv: fakeCardCvv
}

function generateFakeCardExpiration() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript'te aylar 0-11 arası
    const currentYear = today.getFullYear();

    let month, year;

    if (currentMonth === 12) {
        month = Math.floor(Math.random() * 12) + 1;
        year = currentYear + 1 + Math.floor(Math.random() * 4);
    } else {
        // Bu yıl içinde gelecek bir ay seç veya gelecek yıllardan bir tarih seç
        month = Math.floor(Math.random() * (13 - currentMonth)) + currentMonth;
        if (month === currentMonth) {
            month++;
        }
        year = month > 12 ? currentYear + 1 : currentYear;
        month = month > 12 ? month - 12 : month;

        // Eğer bu yılsa, yılı bir arttırma şansı ekle
        if (year === currentYear && Math.random() < 0.5) {
            year++;
            month = Math.floor(Math.random() * 12) + 1;
        }

        // Maksimum 5 yıl ileri git
        const maxYear = currentYear + 5;
        if (year === currentYear) {
            year += Math.floor(Math.random() * (maxYear - currentYear));
        }
    }

    const formattedMonth = month.toString().padStart(2, '0');
    const formattedYear = year.toString().slice(-2);

    return `${formattedMonth}/${formattedYear}`;
}

function chooseFaceCardNumber() {
    const cardNumbers = [
        "5890 0400 0000 0016",
        "5526 0800 0000 0006",
        "4766 6200 0000 0001",
        "4603 4500 0000 0000",
        "4987 4900 0000 0002",
        "5311 5700 0000 0005",
        "9792 0200 0000 0001",
        "9792 0300 0000 0000",
        "5170 4100 0000 0004",
        "5400 3600 0000 0003",
        "3744 2700 0000 003",
        "4475 0500 0000 0003",
        "5528 7900 0000 0008",
        "4059 0300 0000 0009",
        "5504 7200 0000 0003",
        "5892 8300 0000 0000",
        "4543 5900 0000 0006",
        "4910 0500 0000 0006",
        "4157 9200 0000 0002",
        "5168 8800 0000 0002",
        "5451 0300 0000 0000"
    ]

    return cardNumbers[Math.floor(Math.random() * cardNumbers.length)];
}

export default {BillingData, AddressData, CreditCardData};