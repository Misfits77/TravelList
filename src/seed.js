import { collection, addDoc } from "firestorage";

const seed = () => {
  const appliances = addDoc(collection("categories"), {
    name: "Appliances",
  });
  const clothes = addDoc(collection("categories"), {
    name: "Clothes",
  });
  const documents = addDoc(collection("categories"), {
    name: "Documents",
  });
  const children = addDoc(collection("categories"), { name: "Children" });
  const pet = addDoc(collection("categories"), {
    name: "Pet",
  });
  const toiletries = addDoc(collection("categories"), {
    name: "Toiletries",
  });
  const miscellaneous = addDoc(collection("categories"), {
    name: "Miscellaneous",
  });

  //items
  const smartphone = addDoc(collection("items"), {
    name: "smartphone",
    categoryId: appliances.id,
  });
  const tablet = addDoc(collection("items"), {
    name: "tablet",
    categoryId: appliances.id,
  });
  const pc = addDoc(collection("items"), {
    name: "macbook",
    categoryId: appliances.id,
  });
  const charger = addDoc(collection("items"), {
    name: "charger",
    categoryId: appliances.id,
  });
  const smartwatch = addDoc(collection("items"), {
    name: "smartwatch",
    categoryId: appliances.id,
  });
  const socks = addDoc(collection("items"), {
    name: "socks",
    categoryId: clothes.id,
  });
  const coat = addDoc(collection("items"), {
    name: "coat",
    categoryId: clothes.id,
  });
  const passport = addDoc(collection("items"), {
    name: "passport",
    categoryId: documents.id,
  });
  const toys = addDoc(collection("items"), {
    name: "toys",
    categoryId: children.id,
  });
  const catFood = addDoc(collection("items"), {
    name: "cat food",
    categoryId: pet.id,
  });
  const sunscreen = addDoc(collection("items"), {
    name: "sunscreen",
    categoryId: toiletries.id,
  });
  const umbrella = addDoc(collection("items"), {
    name: "umbrella",
    categoryId: miscellaneous.id,
  });
};

export default seed;
