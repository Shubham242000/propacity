import { useEffect, useState } from "react";
import "./App.css";

const tabs = {
  entrees: { title: "Entrees", content: "Entrees" },
  mains: { title: "Mains", content: "Mains" },
  desserts: { title: "Desserts", content: "Desserts" },
};

const formByTab = {
  entrees: [
    { id: "oysters", type: "checkbox" },
    { id: "scallops", type: "checkbox" },
    { id: "tuna", type: "checkbox" },
  ],
  mains: [
    { id: "beef", type: "checkbox" },
    { id: "chicken", type: "checkbox" },
    { id: "pasta", type: "checkbox" },
  ],
  desserts: [
    { id: "cake", type: "checkbox" },
    { id: "gelato", type: "checkbox" },
    { id: "pudding", type: "checkbox" },
  ],
};

// eslint-disable-next-line react-refresh/only-export-components
export async function fetchData(tabId) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(formByTab[tabId]), 1000)
  );
}

function App() {
  const [currTab, setCurrTab] = useState("entrees");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const tabName = url.searchParams.get("tabName");
      setCurrTab(tabName || "entrees");
      if (!tabName) {
        url.searchParams.set("tabName", currTab);
        window.history.pushState({}, "", url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Tabs tabs={tabs} currTab={currTab} setCurrTab={setCurrTab} />
      <div
        style={{
          margin: "20px 0",
        }}
      >
        <button onClick={() => setToggle(!toggle)}>show info</button>
        <div
          style={{
            display: toggle ? "block" : "none",
            background: "aqua",
            padding: "10px",
            margin: "8px 0 ",
          }}
        >
          <li>change query param without react hook.</li>
          <li> url should change based on tab click</li>
          <li>
            {" "}
            if user directly lands on a url, correct tab should be selected
          </li>
          <li>
            {" "}
            user should not visit the url which does not have a tabName query
            param{" "}
          </li>
        </div>
      </div>
    </div>
  );
}

const Tabs = ({ tabs, currTab, setCurrTab }) => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabClick = (tabId) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tabName", tabId);
    // window.location.href = url; // another way of doing it.
    window.history.pushState({ tabId }, "", url);
    setCurrTab(tabId);
  };

  const callApi = async (currTab) => {
    try {
      const data = await fetchData(currTab);
      setData(data);
      setLoading(false);
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    callApi(currTab);
  }, [currTab]);

  if (error) {
    return <h1 style={{ color: "red" }}>Error loading that data</h1>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
        }}
      >
        {Object.keys(tabs).map((tab) => (
          <div
            style={{
              fontSize: "1.5rem",
              padding: "10px",
              margin: "10px",
              border: "1px solid black",
              background: currTab === tab ? "aqua" : "",
              cursor: "pointer",
            }}
            key={tab}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <h2>{tabs[currTab]?.content || ""}</h2>

      <div>
        {isLoading
          ? "loading..."
          : data?.map((d) => {
              return (
                <div key={d.id}>
                  <label>{d.id}</label>
                  <input value={d.id} type={d.type} />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default App;
