/// <reference types="cypress" />

describe('Booking API Tests', function () {
    const baseUrl = 'https://restful-booker.herokuapp.com';

    let bookingId;
    let token;

    it('should create a booking', function () {
      const bookingData = {
        firstname: 'Linda',
        lastname: 'Wambua',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '2024-05-23',
          checkout: '2024-05-28'
        },
        additionalneeds: 'Breakfast'
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/booking`,
        body: bookingData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('bookingid');
        bookingId = response.body.bookingid;
        cy.log('Booking ID:', bookingId);
      });
    });

    it('should get the created booking', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/booking/${bookingId}`,
        headers: {
          'Accept': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('firstname', 'Linda');
        expect(response.body).to.have.property('lastname', 'Wambua');
      });
    });

    it('should authenticate and get a token', () => {
      const authData = {
        username: 'admin',
        password: 'password123'
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/auth`,
        body: authData,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        token = response.body.token;
        cy.log('Token:', token);
      });
    });

    it('should update the booking', () => {
      const updateData = {
        firstname: 'Linda',
        lastname: 'Wambua',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2024-05-24',
          checkout: '2024-05-28' // Updated checkout date
        },
        additionalneeds: 'Late Checkout' // Updated additional needs
      };

      cy.request({
        method: 'PUT',
        url: `${baseUrl}/booking/${bookingId}`,
        body: updateData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `token=${token}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('bookingdates');
        expect(response.body.bookingdates).to.have.property('checkout', '2024-05-28');
        expect(response.body).to.have.property('additionalneeds', 'Late Checkout');
      });
    });
  });
  