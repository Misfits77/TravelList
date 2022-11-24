import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where, addDoc } from "firestorage";

function ItemSelect({ handleItemClicked, selectedItems }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categoriesSnapshot = getDocs(collection("categories"));
    const categories = categoriesSnapshot.data();
    setCategories(categories);
  }, []);

  return categories.map((category) => {
    return (
      <Category
        key={category.id}
        category={category}
        handleItemClicked={handleItemClicked}
        selectedItems={selectedItems}
      />
    );
  });
}

function Category({ category, handleItemClicked, selectedItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(
      collection("items"),
      where("categoryId", "==", category.id)
    );
    const itemsSnapshot = getDocs(q);
    const items = itemsSnapshot.data();
    setItems(items);
  }, []);

  return (
    <div className="categories">
      <h3
        onClick={(e) => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
          }
        }}
      >
        {category.name}
      </h3>
      {isOpen && (
        <div>
          {items.map((item) => {
            return (
              <p
                className="items"
                key={item.id}
                onClick={(e) => {
                  handleItemClicked(item);
                }}
              >
                {selectedItems.includes(item.id) ? (
                  <strong>{item.name}</strong>
                ) : (
                  <span>{item.name}</span>
                )}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CreateTravelList() {
  const [listName, setListName] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const handleItemClicked = (item) => {
    if (!selectedItems.includes(item.id)) {
      setSelectedItems((selectedItems) => [...selectedItems, item.id]);
    } else {
      setSelectedItems((selectedItems) =>
        selectedItems.filter((selectedItem) => selectedItem !== item.id)
      );
    }
    return selectedItems;
  };

  const submitTravelList = () => {
    const travelListRef = addDoc(collection("travelLists"), {
      name: listName,
      destination,
      date,
      items: selectedItems,
      selectedItems: [],
    });
    navigate(`/travel-list/${travelListRef.id}`);
  };

  return (
    <>
      <main>
        <form
          className="basic-info"
          onSubmit={(e) => {
            e.preventDefault();
            submitTravelList();
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
            <ItemSelect
              handleItemClicked={handleItemClicked}
              selectedItems={selectedItems}
            />
            <h5>
              You can create some custom categories to add your own items too!
            </h5>
          </div>
          <nav className="basic-info">
            <button>Create</button>
          </nav>
        </form>
      </main>
      <nav>
        <Link to="/">
          <button className="home-button">Home</button>
        </Link>
      </nav>
    </>
  );
}

export default CreateTravelList;
