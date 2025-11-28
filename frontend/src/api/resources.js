import API from "./api";

// GET all resources
export const getResources = async () => {
  const res = await API.get("/api/resources");
  return res.data;
};

// CREATE resource
export const createResource = async (data) => {
  const res = await API.post("/api/resources", data);
  return res.data;
};

// LIKE resource
export const likeResource = async (id) => {
  const res = await API.post(`/api/resources/${id}/like`);
  return res.data;
};

// DELETE resource
export const deleteResourceAPI = async (id) => {
  const res = await API.delete(`/api/resources/${id}`);
  return res.data;
};
// Fetch all groups + resources for filtering on frontend
export const getAllGroups = async () => {
  const res = await API.get("/api/groups");
  return res.data;
};

export const getAllResources = async () => {
  const res = await API.get("/api/resources");
  return res.data;
};

