import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import {AuthProvider} from './authContext';
import {ModalProvider} from './modalContext';

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ModalProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ModalProvider>
    </BrowserRouter>
);
