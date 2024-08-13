// import { FormEvent, useState } from "react";
// import { Loader, Placeholder } from "@aws-amplify/ui-react";
// import "./App.css";
// import { Amplify } from "aws-amplify";
// import { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// import outputs from "../amplify_outputs.json";


// import "@aws-amplify/ui-react/styles.css";

// Amplify.configure(outputs);

// const amplifyClient = generateClient<Schema>({
//   authMode: "userPool",
// });

// function App() {
//   const [result, setResult] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData(event.currentTarget);
      
//       const { data, errors } = await amplifyClient.queries.askBedrock({
//         ingredients: [formData.get("ingredients")?.toString() || ""],
//       });

//       if (!errors) {
//         setResult(data?.body || "No data returned");
//       } else {
//         console.log(errors);
//       }

  
//     } catch (e) {
//       alert(`An error occurred: ${e}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="header-container">
//         <h1 className="main-header ">
//           <span className="heading">Meet Your Personal</span>
//           <br />
//           <span className="highlight">AI Recipe Assistant</span>
//         </h1>
//         <p className="description">
//           Simply type a few ingredients using the format ingredient1,
//           ingredient2, etc., and Recipe AI will generate an all-new recipe on
//           demand...
//         </p>
//       </div>
//       <form onSubmit={onSubmit} className="form-container">
//         <div className="search-container">
//           <input
//             type="text"
//             className="wide-input"
//             id="ingredients"
//             name="ingredients"
//             placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
//           />
//           <button type="submit" className="search-button">
//             Generate
//           </button>
//         </div>
//       </form>
//       <div className="result-container">
//         {loading ? (
//           <div className="loader-container">
//             <p>Loading...</p>
//             <Loader size="large" />
//             <Placeholder size="large" />
//             <Placeholder size="large" />
//             <Placeholder size="large" />
//           </div>
//         ) : (
//           result && <p className="result">{result}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pantryItems, setPantryItems] = useState<{ name: string; count: number }[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newCount, setNewCount] = useState(1);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }
  
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const addPantryItem = () => {
    if (newIngredient.trim() !== "") {
      const existingItemIndex = pantryItems.findIndex(item => item.name.toLowerCase() === newIngredient.trim().toLowerCase());
      if (existingItemIndex > -1) {
        const updatedPantryItems = [...pantryItems];
        updatedPantryItems[existingItemIndex].count += newCount;
        setPantryItems(updatedPantryItems);
      } else {
        setPantryItems([...pantryItems, { name: newIngredient.trim(), count: newCount }]);
      }
      setNewIngredient("");
      setNewCount(1);
    }
  };

  const updateItemCount = (index: number, count: number) => {
    const updatedPantryItems = [...pantryItems];
    updatedPantryItems[index].count = count;
    setPantryItems(updatedPantryItems);
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          <span className="heading poppins-thin">Meet Your Personal</span>
          <br />
          <span className="highlight playwrite">AI Recipe Assistant</span>
        </h1>
        <p className="description poppins-small">
          Simply type a few ingredients using the format ingredient1,
          ingredient2, etc., and Recipe AI will generate an all-new recipe on
          demand...
        </p>
      </div>
      <div className="pantry-container glass poppins-small">
        <h2>Your Pantry</h2>
        <ul>
          {pantryItems.map((item, index) => (
            <li key={index}>
              {item.name} (x{item.count})
              <input
                type="number"
                value={item.count}
                onChange={(e) => updateItemCount(index, parseInt(e.target.value, 10))}
                min="1"
              />
            </li>
          ))}
        </ul>
        <div className="add-pantry-item">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="Add an ingredient"
          />
          <input
            type="number"
            value={newCount}
            onChange={(e) => setNewCount(parseInt(e.target.value, 10))}
            min="1"
            placeholder="Count"
          />
          <button onClick={addPantryItem}>Add</button>
        </div>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container poppins-small">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;
