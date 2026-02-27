# Sahayak: The College Syllabus Assistant 🎓

Sahayak ("Helper/Assistant" in Sanskrit) is an open-source, community-driven platform designed to demystify college semantics. It acts as an academic encyclopedia, providing students with structured breakdowns of their courses, critical study strategies, and curated study materials, turning overwhelming syllabi into actionable roadmaps.

![Sahayak Academic Theme Concept](https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop)

## Features 🚀

- **📚 Curated Academics:** Browse a vast archive of subjects with beautifully formatted, encyclopedic deep-dives into difficulty, scoring potential, and exact time investments needed.
- **🔍 On-The-Fly Search:** Instantly filter and search for courses by name, branch, core topics, or IDs with an elegant real-time engine.
- **📑 Unit-by-Unit Breakdowns:** Granular visibility into the postulates of each unit and its relative reward-to-effort ratios. 
- **🎓 Strategic Blueprints:** Find specific battle-tested modes of study tailored to Mid-Semester crunches, End-Semester marathons, or 1-day rapid reviews, complete with Previous Year Question Paper (PYQ) attachments.
- **📝 Community Contributions:** A streamlined "Contribute" wizard allowing upperclassmen and scholars to append their knowledge regarding courses they've survived. 
- **🛡️ Admin Archiving:** Built-in dashboard and moderation capabilities to review, edit, or publish incoming syllabus contributions.
- **🖨️ Archival Export:** Distraction-free, watermarked "Export to PDF" using native browser print optimizations for offline study sessions.

## Architecture & Tech Stack

Sahayak uses a decoupled, modern stack with a uniquely styled vintage "Bento" aesthetic:

### Frontend
- **Framework:** Next.js (React 19) App Router
- **Styling:** Tailwind CSS v4 (Custom Academic Green/Gold/Parchment palette)
- **Icons:** Lucide React
- **Typography:** Custom serif (Newsreader/Playfair/Georgia) and stark sans-serif contrasts.

### Backend
- **Framework:** FastAPI (Python)
- **Database Operations:** Asynchronous Motor (`motor-asyncio`)
- **Database Layer:** MongoDB
- **Authentication:** JWT (JSON Web Tokens) with Argon2 Password Hashing
- **Validation:** Pydantic

## Getting Started 🛠️

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- MongoDB Community Server (running locally on `mongodb://localhost:27017` or Atlas cluster)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Sahayak.git
   cd Sahayak
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Setup your environment variables
   # Create a .env file and add your MongoDB connection string & JWT secrets
   echo "MONGO_URI=mongodb://localhost:27017" > .env
   echo "SECRET_KEY=your_super_secret_jwt_key" >> .env
   
   # Run the development server
   uvicorn main:app --reload
   ```

3. **Frontend Setup:**
   ```bash
   # Open a new terminal tab
   cd ../frontend
   npm install
   
   # Set the API boundary 
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   
   # Run the application
   npm run dev
   ```

4. **Access the App:** 
   Navigate to `http://localhost:3000` in your browser. The backend API schema can be viewed at `http://localhost:8000/docs`.

## Automated Startup

For macOS/Linux users, an execution script is included at the root directory to spin up both environments simultaneously:
```bash
chmod +x start_app.sh
./start_app.sh
```

## Contributing 🤝

We welcome all contributions from the student community! To directly submit content to the platform natively, log in and use the "Contribute" tab.
If you're a developer wanting to add core functionality to Sahayak, please fork the repository and submit a PR for review. Ensure you run your tests and lints!

## License 📜

This project is licensed under the MIT License - see the LICENSE file for details. `Scientia potentia est.`
