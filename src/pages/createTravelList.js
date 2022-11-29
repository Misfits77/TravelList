import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import {
  RiCheckboxFill,
  RiDeleteBin2Fill,
  RiHome2Fill,
  RiAddBoxLine,
} from "react-icons/ri";
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
        className="categoryName"
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
            className="removeButtoninCreate"
            onClick={(e) => {
              removeCategory(category);
            }}
          >
            {" "}
            <RiDeleteBin2Fill />
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
                    className="removeButtoninCreate"
                    onClick={(e) => {
                      removeItem(item);
                    }}
                  >
                    {" "}
                    <RiDeleteBin2Fill />
                  </span>
                )}
              </p>
            );
          })}
          <div className="customItemContainer">
            <label>
              Custom Item
              <input
                className="inputCustom"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
              />
            </label>
            <button
              className="addButtoninCreate"
              onClick={(e) => {
                e.preventDefault();
                createCustomItem();
              }}
            >
              <RiAddBoxLine />
            </button>
          </div>
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
      <nav className="navbarinCreate">
        <Link to="/">
          <button className="home-button">
            <RiHome2Fill />
          </button>
        </Link>
      </nav>
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
              className="inputCreate"
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
              className="inputCreate"
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
              className="inputCreate"
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
            <label className="createFormContainer">
              <h5>
                You can create some custom categories to add your own items too!
              </h5>
              <div className="customCategoryinCreate">
                <input
                  className="inputCustom"
                  value={customCategoryName}
                  onChange={(e) => {
                    setCustomCategoryName(e.target.value);
                  }}
                />
                <button
                  className="addButtoninCreate"
                  onClick={(e) => {
                    e.preventDefault();
                    createCustomCategory();
                  }}
                >
                  <RiAddBoxLine />
                </button>
              </div>
            </label>
          </div>
          <nav className="navBottominCreate">
            <button className="submitCreate">
              Done <RiCheckboxFill />
            </button>
          </nav>
        </form>
      </main>
    </>
  );
}

export default CreateTravelList;
