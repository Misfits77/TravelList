import { Link, useNavigate } from "react-router-dom";
import { cloneElement, useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  doc,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firestorage";
import { RiChatCheckFill, RiChatDeleteLine, RiHome2Fill } from "react-icons/ri";
import _, { forEach } from "underscore";

function ItemSelect({
  handleItemClicked,
  selectedItems,
  categories,
  removeCategory,
}) {
  return categories.map((category) => {
    return (
      <Category
        key={category.id}
        category={category}
        handleItemClicked={handleItemClicked}
        selectedItems={selectedItems}
        removeCategory={removeCategory}
      />
    );
  });
}

function Category({
  category,
  handleItemClicked,
  selectedItems,
  removeCategory,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [customItemName, setCustomItemName] = useState("");

  useEffect(() => {
    const q = query(
      collection("items"),
      where("categoryId", "==", category.id)
    );
    const itemsSnapshot = getDocs(q);
    const items = itemsSnapshot.data();
    setItems(items);
  }, []);

  const createCustomItem = () => {
    const customItemRef = addDoc(collection("items"), {
      name: customItemName,
      categoryId: category.id,
      custom: true,
    });

    setItems([
      ...items,
      {
        name: customItemName,
        categoryId: category.id,
        id: customItemRef.id,
        custom: true,
      },
    ]);
  };

  const removeItem = (item) => {
    deleteDoc(doc("items", item.id));
    setItems(
      items.filter((i) => {
        if (i.id === item.id) {
          return false;
        } else {
          return true;
        }
      })
    );
  };

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
        {category.custom && (
          <span
            onClick={(e) => {
              removeCategory(category);
            }}
          >
            {" "}
            <RiChatDeleteLine />
          </span>
        )}
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
                {item.custom && (
                  <span
                    onClick={(e) => {
                      removeItem(item);
                    }}
                  >
                    {" "}
                    <RiChatDeleteLine />
                  </span>
                )}
              </p>
            );
          })}
          <label>
            Custom Item
            <input
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
            />
          </label>
          <button
            onClick={(e) => {
              e.preventDefault();
              createCustomItem();
            }}
          >
            Add
          </button>
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
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const categoriesSnapshot = getDocs(collection("categories"));
    const categories = categoriesSnapshot.data();
    setCategories(categories);
  }, []);

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

  const createCustomCategory = () => {
    const customCategoryRef = addDoc(collection("categories"), {
      name: customCategoryName,
      custom: true,
    });
    setCategories([
      ...categories,
      { name: customCategoryName, id: customCategoryRef.id, custom: true },
    ]);
  };

  const removeCategory = (category) => {
    deleteDoc(doc("categories", category.id));
    const q = query(
      collection("items"),
      where("categoryId", "==", category.id)
    );
    const items = getDocs(q).data();
    items.forEach((item) => {
      deleteDoc(doc("items", item.id));
    });

    const itemIds = items.map((i) => i.id);
    const q2 = query(
      collection("travelLists"),
      where("items", "array-contains-any", itemIds)
    );
    const travelLists = getDocs(q2).data();
    travelLists.forEach((travelList) => {
      const difference = _.difference(travelList.items, itemIds);
      updateDoc(doc("travelLists", travelList.id), { items: difference });
    });

    setCategories(
      categories.filter((c) => {
        if (c.id === category.id) {
          return false;
        } else {
          return true;
        }
      })
    );
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
              categories={categories}
              handleItemClicked={handleItemClicked}
              selectedItems={selectedItems}
              removeCategory={removeCategory}
            />
            <h5>
              You can create some custom categories to add your own items too!
            </h5>
            <label>
              <h5>Custom Category</h5>
              <input
                value={customCategoryName}
                onChange={(e) => {
                  setCustomCategoryName(e.target.value);
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  createCustomCategory();
                }}
              >
                Add
              </button>
            </label>
          </div>
          <nav className="basic-info">
            <button>
              <RiChatCheckFill />
            </button>
          </nav>
        </form>
      </main>
      <nav>
        <Link to="/">
          <button className="home-button">
            <RiHome2Fill />
          </button>
        </Link>
      </nav>
    </>
  );
}

export default CreateTravelList;
