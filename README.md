# Acadamix LMS

Acadamix is a modern Learning Management System (LMS) built with React and Firebase. It provides a seamless platform for students, faculty, and administrators to manage courses, assignments, and user data efficiently.

---

## Features

- **Role-Based Dashboards**
  - **Student:** View courses, submit assignments (file/folder upload), track progress.
  - **Faculty:** Create/manage courses, assignments, grade submissions.
  - **Admin:** Manage users, courses, and platform analytics.

- **Authentication:** Secure registration and login with role selection.
- **Course & Assignment Management:** Real-time updates, assignment creation, and grading.
- **Profile Management:** Users can update their profile information.
- **Responsive UI:** Modern, mobile-friendly design with Tailwind CSS.
- **File Uploads:** Students can upload folders/files for assignments.
- **Real-Time Data:** Firestore listeners keep data up-to-date.

---

## Technology Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Firebase Authentication, Firestore, Firebase Storage
- **Build Tool:** Vite

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Firebase project (with Auth, Firestore, and Storage enabled)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Manjunath3477/Acadamix.git
    cd Acadamix
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure Firebase:**
    - Copy your Firebase config to `src/firebaseConfig.js`:
      ```js
      import { initializeApp } from 'firebase/app';
      import { getFirestore } from 'firebase/firestore';
      import { getStorage } from 'firebase/storage';
      import { getAuth } from 'firebase/auth';

      const firebaseConfig = {
        // your firebase config here
      };

      const app = initializeApp(firebaseConfig);
      export const db = getFirestore(app);
      export const storage = getStorage(app);
      export const auth = getAuth(app);
      ```

4. **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

---

## Usage

- Visit the landing page and register as a student, faculty, or admin.
- Students can enroll in courses, view modules, and submit assignments.
- Faculty can create courses, assignments, and grade student submissions.
- Admins can manage users and courses.

---

## Folder Structure

```
src/
  components/
    assignments/
    common/
    icons/
  pages/
    dashboards/
    auth/
  firebaseConfig.js
  App.jsx
  main.jsx
  ...
```

---

## Security

- Only authenticated users can access dashboards and upload files.
- Firestore and Storage rules should be set to restrict access based on user roles.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
