export const initialState = {
  consignors: {
    "2": {
      id: 2,
      firstName: "Bob",
      lastName: "Perkins",
      email: "bob@gmail.com",
      company: "",
      address: "123 North St.",
      address2: "",
      city: "Chicago",
      state: "IL",
      zip: "12345",
      items: [
        "2","5","7"
      ]
    },
    "7": {
      id: 7,
      firstName: "Fred",
      lastName: "Sanders",
      email: "fsanders@gmail.com",
      company: "",
      address: "1548 N. Landers St.",
      address2: "",
      city: "Pensacola",
      state: "FL",
      zip: "12345",
      items: [
        "3"
      ]
    }
  },
  items: {
    "2": {
      id: "2",
      title: "pants",
      brand: "GAP",
      color: "black",
      size: "32",
      price: 15.99,
      consignorid: "2"
    },
    "3": {
      id: "3",
      title: "shirt",
      brand: "Old Navy",
      color: "blue",
      size: "L",
      price: 12.99,
      consignorid: "7"
    },
    "5": {
      id: "5",
      title: "skirt",
      brand: "Some Brand",
      color: "purple",
      size: "2",
      price: 23.99,
      consignorid: "2"
    },
    "7": {
      id: "7",
      title: "shirt",
      brand: "Some Shirt Brand",
      color: "red",
      size: "5",
      price: 8.99,
      consignorid: "2"
    }
  }
};
