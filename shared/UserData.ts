import { faker } from '@faker-js/faker';

export interface User {
  title: 'Mr' | 'Mrs';
  name: string;
  email: string;
  password: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  newsletter: boolean;
  specialOffers: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export function generateUser(): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    title: faker.helpers.arrayElement(['Mr', 'Mrs']),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    password: faker.internet.password(),
    dateOfBirth: {
      day: faker.date.birthdate().getDate().toString(),
      month: (faker.date.birthdate().getMonth() + 1).toString(),
      year: faker.date.birthdate().getFullYear().toString(),
    },
    newsletter: faker.datatype.boolean(),
    specialOffers: faker.datatype.boolean(),
    firstName: firstName,
    lastName: lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.phone.number(),
  };
}
