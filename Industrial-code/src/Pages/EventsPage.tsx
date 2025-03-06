import React, { useState, ChangeEvent, FormEvent } from 'react';
import style from '../styles/Events.module.css';
import { createEvent } from '../services/Api/Event';
import EventsDisplay from './EventsDisplay';
interface FormData {
  title: string;
  description: string;
  images: File | null;
}

const EventsPage: React.FC = () => {
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    images: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input for image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        images: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Use FormData to handle the file upload
    const eventData = new FormData();
    eventData.append('title', formData.title);
    eventData.append('description', formData.description);
    if (formData.images) {
      eventData.append('images', formData.images);
    }

    try {
      const response = await createEvent(eventData);

      if (response.success) {
        alert("Created Event Successfully!!");
      } else {
        alert("Error occurred while creating Event");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("Error occurred");
    }
  };

  return (
    <>
      <div className={style.maincontainer}>
        <h1>EVENTS</h1>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formGroup}>
            <label className={style.label} htmlFor="title">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              className={style.input}
              required
            />
          </div>

          <div className={style.formGroup}>
            <label className={style.label} htmlFor="description">
              Event Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter event description"
              className={style.textarea}
              rows={4}
              required
            ></textarea>
          </div>

          <div className={style.formGroup}>
            <label className={style.label} htmlFor="image">
              Upload Event Image
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              onChange={handleImageChange}
              className={style.input}
            />
            {previewImage && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={previewImage}
                  alt="Selected"
                  className={style.imagePreview}
                />
              </div>
            )}
          </div>

          <button type="submit" className={style.button}>
            Submit Event
          </button>
        </form>
      </div>
      <div>
        <h1>Current Events</h1>
        <EventsDisplay />
      </div>
    </>
  );
};

export default EventsPage;
