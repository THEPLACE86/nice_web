const loadDataFromLocalStorage = (key) => {
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData) {
            return JSON.parse(jsonData);
        }
        return null;
    } catch (error) {
        console.error('Error loading data from localStorage.js:', error);
        return null;
    }
};

export default loadDataFromLocalStorage