import API from "./api";

// GET all groups
export const getGroups = async () => {
  const res = await API.get("/api/groups");
  return res.data;
};

// CREATE group
export const createGroupAPI = async (data) => {
  const res = await API.post("/api/groups", data);
  return res.data;
};

// JOIN group
export const joinGroupAPI = async (id) => {
  const res = await API.post(`/api/groups/${id}/join`);
  return res.data;
};

// LEAVE group
export const leaveGroupAPI = async (id) => {
  const res = await API.post(`/api/groups/${id}/leave`);
  return res.data;
};

// DELETE group
export const deleteGroupAPI = async (id) => {
  const res = await API.delete(`/api/groups/${id}`);
  return res.data;
};
