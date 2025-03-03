import React from 'react'
import FormDb from './FormData';
export default function FormData() {
  return (
        <React.Fragment>
            <div className="auth-page-content">
                <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center">
                    <FormDb/>
                </div>
            </div>
        </React.Fragment>
    );
  
}