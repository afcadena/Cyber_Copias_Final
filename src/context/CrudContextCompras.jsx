import { createContext, useState, useEffect, useContext } from 'react';
import { helpHttp } from '../helpers/helpHttp';

const CrudContextCompras = createContext();

export function CrudProviderCompras({ children }) {
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = helpHttp();
  const url = 'http://localhost:3000/compras';

  useEffect(() => {
    setLoading(true);
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb([]);
        setError(res);
      }
      setLoading(false);
    });
  }, [url]);

  const createData = (data) => {
    const options = {
      body: data,
      headers: { 'Content-Type': 'application/json' },
    };

    api.post(url, options).then((res) => {
      if (!res.err) {
        setDb((prevDb) => [...prevDb, res]);
      } else {
        setError(res);
      }
    });
  };

  const updateData = (data) => {
    const endpoint = `${url}/${data.id}`;
    const options = {
      body: data,
      headers: { 'Content-Type': 'application/json' },
    };

    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        const updatedDb = db.map((el) => (el.id === data.id ? data : el));
        setDb(updatedDb);
      } else {
        setError(res);
      }
    });
  };

  const deleteData = (id) => {
    const endpoint = `${url}/${id}`;
    const options = {
      headers: { 'Content-Type': 'application/json' },
    };

    api.del(endpoint, options).then((res) => {
      if (!res.err) {
        const updatedDb = db.filter((el) => el.id !== id);
        setDb(updatedDb);
      } else {
        setError(res);
      }
    });
  };

  return (
    <CrudContextCompras.Provider value={{ db, createData, updateData, deleteData, dataToEdit, setDataToEdit, error, loading }}>
      {children}
    </CrudContextCompras.Provider>
  );
}

export const useCrudContextCompras = () => useContext(CrudContextCompras);

export default CrudContextCompras;
