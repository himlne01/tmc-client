import { useState } from "react";
import '../index.css';

function UploadImage({consolelog}) {
    const [file, setFile] = useState(null);
    const [uploaded, setUploaded] = useState(false);

    const handleImageResponse = (response) => {
        consolelog(response.data.link);
        setUploaded(true);
    };

    const handleFileInput = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let data = new FormData();
        data.append("image", file);

        const init = {
            method: "POST",
            headers: {
                Authorization: "Client-ID 53fa3e7c9c249c7"
            },
            body: data
        };

        fetch("https://api.imgur.com/3/image", init)
            .then(response => response.json())
            .then(handleImageResponse)
            .catch(console.log);
    };

    return(
        <form onSubmit={handleSubmit} className="image-form">
            <div className="row">
                <div className="col-11">

                    <input className="" id="file" type="file" onChange={handleFileInput}/>
                </div>
                <div className="col-1">
                    <button disabled={!file} type="submit" className="btn btn-secondary mb-2 mt-2 uploadButton">Upload</button>
                {uploaded ? <p>Upload successful!</p> : <></>}
                </div>
                
            </div>
        </form>
    );
}

export default UploadImage;