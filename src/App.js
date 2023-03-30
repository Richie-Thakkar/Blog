import React, { useState,useEffect } from "react";
import firebase from "firebase/app";
import { Timestamp, collection,doc, addDoc,getDocs,deleteDoc,setDoc ,updateDoc} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "./firebase-config";
import { toast } from "react-toastify";
import "./App.css";
export default function AddArticle() {
    const [articles, setArticles] = useState([]);
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: "",
      createdAt: Timestamp.now().toDate(),
    });
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const fetchArticles = async () => {
        const articlesCollection = collection(db, "Entries");
        const articlesSnapshot = await getDocs(articlesCollection);
        const articlesList = articlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesList);
      };
      fetchArticles();
    }, []);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleImageChange = (e) => {
      setFormData({ ...formData, image: e.target.files[0] });
    };
  
    const handlePublish = () => {
      if (!formData.title || !formData.description || !formData.image) {
        alert("Please fill all the fields");
        return;
      }
      const storageRef = ref(
        storage,
        `/images/${Date.now()}${formData.image.name}`
      );
      const uploadImage = uploadBytesResumable(storageRef, formData.image);
      uploadImage.on(
        "state_changed",
        (snapshot) => {
          const progressPercent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progressPercent);
        },
        (err) => {
          console.log(err);
        },
        () => {
          setFormData({
            title: "",
            description: "",
            image: "",
          });
          getDownloadURL(uploadImage.snapshot.ref).then((url) => {
            const articleRef = collection(db, "Entries");
            addDoc(articleRef, {
              title: formData.title,
              description: formData.description,
              ImageUrl: url,
              createdAt: Timestamp.now().toDate(),
            })
              .then(() => {
                toast("Article added successfully", { type: "success" });
                setProgress(0);
              })
              .catch((err) => {
                toast("Error adding article", { type: "error" });
              });
          });
        }
      );
    };
    
const handleDelete = async (articleId) => {
  if (window.confirm("Are you sure you want to delete this article?")) {
    try {
      const articleRef = doc(collection(db, "Entries"), articleId);
      await deleteDoc(articleRef);
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== articleId)
      );
      toast("Article deleted successfully", { type: "success" });
    } catch (error) {
      toast("Error deleting article", { type: "error" });
    }
  }
};

    return (
        <div className="container" style={{ maxHeight: "80vh", overflowY: "auto"  }}>
          <h2>Create article</h2>
          <br/>
          <div>
            <label htmlFor="">Title</label>
            <br/>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <br/>
          {/* description */}
          <label htmlFor="">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
          />
          {/* image */}
          <br/>
          <label htmlFor="">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
          />
          <br/>
          {progress === 0 ? null : (
            <div className="progress">
              <div
                
                style={{ width: `${progress}%` }}
              >
                {`uploading image ${progress}%`}
              </div>
            </div>
          )}
          <br/>
          <button onClick={handlePublish} className="form-button">
            Publish
          </button>
          <br/>
          <br/>
          <br/>
          <div>
            {articles.map((article) => (
              <div className="article" key={article.id}>
                <img src={article.ImageUrl} alt={article.title} style={{width:250, margin:20}}/>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <button className="delete-button"onClick={() => handleDelete(article.id)}>
                  Delete
                </button>
                
              </div>
            ))}
          </div>
        </div>
      );
       
}
