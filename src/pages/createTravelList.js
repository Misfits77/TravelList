import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firestorage";

function CreateTravelList() {
  const [listName, setListName] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categoriesSnapshot = getDocs(collection("categories"));
    const categories = categoriesSnapshot.data();
    setCategories(
      categories.map((category) => {
        return { id: category.id, name: category.name, selected: false };
      })
    );
  }, []);

  const selectCategories = (id) => {
    const selectedCategories = categories.map((category) => {
      if (category.id === id) {
        return {
          id: category.id,
          name: category.name,
          selected: category.selected ? false : true,
        };
      }
      return category;
    });

    setCategories(selectedCategories);
  };

  return (
    <>
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label>
            List Name
            <input
              required
              value={listName}
              onChange={(e) => {
                setListName(e.target.value);
              }}
            ></input>
          </label>
          <label>
            Destination
            <input
              required
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
            ></input>
          </label>
          <label>
            Date
            <input
              required
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            ></input>
          </label>
          <div>
            <h3>Select categories for your Travel List</h3>
            <ul>
              {categories.map((category) => {
                return (
                  <li
                    onClick={(e) => {
                      selectCategories(category.id);
                    }}
                  >
                    {category.selected ? (
                      <strong>{category.name}</strong>
                    ) : (
                      <p>{category.name}</p>
                    )}
                  </li>
                );
              })}
            </ul>
            <h5>You can create some custom categories too!</h5>
          </div>
          <button>Create</button>
        </form>
      </main>
      <nav>
        <Link to="/">
          <button>Home</button>
        </Link>
      </nav>
    </>
  );
}

export default CreateTravelList;
