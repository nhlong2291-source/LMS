import axios from "./axios";

// shopApi: convenience wrappers for shop-related endpoints
// Endpoints used (conventional names):
// GET  /shop/items                 -> list available shop items
// GET  /shop/items/:id             -> get single item details
// POST /shop/items/:id/redeem      -> redeem/purchase an item (body: { quantity, ... })
// GET  /shop/inventory             -> list user's owned items
// GET  /shop/balance               -> get user's gem/balance

export async function fetchShopItems(params = {}) {
  try {
    const res = await axios.get("/shop/items", { params });
    return res.data;
  } catch (err) {
    // normalize error
    throw (err.response && err.response.data) || err;
  }
}

export async function fetchShopItem(itemId) {
  try {
    const res = await axios.get(`/shop/items/${itemId}`);
    return res.data;
  } catch (err) {
    throw (err.response && err.response.data) || err;
  }
}

export async function redeemItem(itemId, body = {}) {
  try {
    const res = await axios.post(`/shop/items/${itemId}/redeem`, body);
    return res.data;
  } catch (err) {
    throw (err.response && err.response.data) || err;
  }
}

export async function fetchUserInventory() {
  try {
    const res = await axios.get("/shop/inventory");
    return res.data;
  } catch (err) {
    throw (err.response && err.response.data) || err;
  }
}

export async function fetchUserBalance() {
  try {
    const res = await axios.get("/shop/balance");
    return res.data;
  } catch (err) {
    throw (err.response && err.response.data) || err;
  }
}

export default {
  fetchShopItems,
  fetchShopItem,
  redeemItem,
  fetchUserInventory,
  fetchUserBalance,
};
