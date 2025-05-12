import axios from 'axios';

const BASE_URL = 'https://graphia-p735.onrender.com/api/'
export const SERVER_URL = 'https://graphia-p735.onrender.com'
const LOGIN_URL = `${BASE_URL}token/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const NOTES_URL = `${BASE_URL}notes/`
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`
const REGISTER_URL = `${BASE_URL}register/`
const LOGOUT_URL = `${BASE_URL}logout/`
const TOOGLE_FOLLOW = `${BASE_URL}toggle_follow/`




axios.defaults.withCredentials = true; 

export const login = async (username, password) => {
    try {
        const response = await axios.post(
            LOGIN_URL, 
            { username, password },  // Object shorthand for cleaner syntax
            { withCredentials: true }  // Ensures cookies are included
        );
        
        // Check if the response contains a success attribute (depends on backend response structure)
        return response.data
    } catch (error) {
        console.error("Login failed:", error);
        return false;  // Return false or handle the error as needed
    }
};


export const refresh_token = async () =>{
    try{
        await axios.post(REFRESH_URL,
            {},
            { withCredentials: true }
        )
        return true
    }catch(error){
        return false
    }
}

export const get_notes = async () => {
    try{
        const response = await axios.get(NOTES_URL, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, axios.get(NOTES_URL, { withCredentials: true }))
    }
};

const call_refresh = async (error, func) =>{
    if(error.response && error.response.status === 401){
        const tokenRefreshed = await refresh_token()

        if(tokenRefreshed){
            const retryResponse = await func()
            return retryResponse.data
        }
    }
    return false
}

export const logout = async () => {
    const response = await axios.post(LOGOUT_URL, { withCredentials: true });
    return response.data;
};

export const register = async (username, email, password) => {
    const response = await axios.post(REGISTER_URL, {username, email, password}, { withCredentials: true });
    return response.data;
};

export const authenticated_user = async () => {
    try{
        await axios.post(AUTHENTICATED_URL,{}, { withCredentials: true });
        return true
    }catch(error){
        return false
    }
}

const api = axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})

export const request_password_reset = async (email) => {
    const response = await api.post(`requestPasswordReset/`, {email: email});
    return response.data;
};

export const reset_password = async (username, token, new_password) => {
    const response = await api.post(`resetPassword/${username}/${token}/`, {new_password: new_password});
    return response.data;
};

// user profile data and posts data apis start
export const get_user_profile_info = async (username) => {
    try{
        const response = await api.get(`user_data/${username}/`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`user_data/${username}/`, { withCredentials: true }));
    }
};

export const get_users_posts = async (username) => {
    try{
        const response = await api.get(`posts/${username}/`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`user_data/${username}/`, { withCredentials: true }));
    }
};

export const toggleFollow = async (username) => {
    const response = await axios.post(TOOGLE_FOLLOW,{username:username}, { withCredentials: true });
    return response.data;
};

export const toggleLike = async (id) => {
    const response = await api.post('toggleLike/',{id:id}, { withCredentials: true });
    return response.data;
};

export const create_post = async (value) => {
    const response = await api.post('create_post/', value,{ headers:{'Content-Type': 'multipart/form-data'}}, { withCredentials: true });
    return response.data;
};

export const get_posts = async (num) =>{
    try{
        const response = await api.get(`get_posts/?page=${num}`)
        return response.data
    }catch(error){
        return call_refresh(error, () => api.get(`get_posts/?page=${num}`));
    }
}

export const get_post_byId = async (id) =>{
    try{
        const response = await api.get(`get_posts_byId/${id}`)
        return response.data
    }catch(error){
        return call_refresh(error, () => api.get(`get_posts_byId/${id}`));
    }
}

export const search_users = async (search) =>{
    const response = await api.get(`search/?query=${search}`)
    return response.data
}

export const update_user = async (values) =>{
    const response = await api.patch('update_user/', values, { headers:{'Content-Type': 'multipart/form-data'}})
    return response.data
}


export const get_group_messages = async (group_name) => {
    try{
        const response = await api.get(`chatrooms/${group_name}/messages/`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`${group_name}/messages/`, { withCredentials: true }));
    }
};

export const get_private_messages = async (group_name) => {
    try{
        const response = await api.get(`chatrooms/${group_name}/private_messages/`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`${group_name}/private_messages/`, { withCredentials: true }));
    }
};

export const create_group = async (groupName, description) => {
    try{
        const response = await api.post(`groups/`,{ group_name: groupName, description: description}, {headers: {'Content-Type': 'application/json',}, withCredentials: true});
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.post(`groups/`,{ group_name: groupName, description: description}, {headers: {'Content-Type': 'application/json',}, withCredentials: true}));
    }
};

export const get_all_groups = async (query) => {
    try{
        const response = await api.get(`groups_list/?search=${query}`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`groups_list/?search=${query}`, { withCredentials: true }));
    }
};

export const get_group_details = async (slug) => {
    try{
        const response = await api.get(`groups_details/${slug}`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`groups_details/${slug}`, { withCredentials: true }));
    }
};

export const join_group = async (group_id) => {
    try{
        const response = await api.get(`groups/${group_id}/join/`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`groups/${group_id}/join/`, { withCredentials: true }));
    }
};

export const leave_group = async (group_id) => {
    try{
        const response = await api.get(`groups/${group_id}/leave/`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`groups/${group_id}/leave/`, { withCredentials: true }));
    }
};

export const get_recent_private_chats = async (query) => {
    try{
        const response = await api.get(`recent_private_chats/?q=${query}`, { withCredentials: true });
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.get(`recent_private_chats/?q=${query}`, { withCredentials: true }));
    }
};

export const create_files_message = async (group, body, file) => {
    try{
        const response = await api.post(`group/${group}/messages/`,{ group: group, body: body, file: file}, {headers: {'Content-Type': "multipart/form-data",}, withCredentials: true});
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.post(`group/${group}/messages/`,{ group: group, body: body, file: file}, {headers: {'Content-Type': "multipart/form-data",}, withCredentials: true}));
    }
};

export const create_private_files_message = async (chat, body, file) => {
    try{
        const response = await api.post(`group/${chat}/private_messages/`,{ chat: chat, body: body, file: file}, {headers: {'Content-Type': "multipart/form-data",}, withCredentials: true});
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.post(`group/${chat}/private_messages/`,{ chat: chat, body: body, file: file}, {headers: {'Content-Type': "multipart/form-data",}, withCredentials: true}));
    }
};


export const get_comments = async (id) =>{
    try{
        const response = await api.get(`get_comment/${id}`)
        return response.data
    }catch(error){
        return call_refresh(error, () => api.get(`get_comment/${id}`));
    }
}

export const create_comment = async (content, id) => {
    try{
        const response = await api.post(`create_comment/${id}`,{ content }, { withCredentials: true});
        return response.data;
    }catch(error){
        return call_refresh(error, () => api.post(`create_comment/${id}`,{ content }, { withCredentials: true}));
    }
};