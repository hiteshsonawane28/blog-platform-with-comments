import{useEffect,useMemo,useState}from'react';import{Link,Route,Routes,useNavigate,useParams}from'react-router-dom';import{BookOpen,ChevronLeft,LogIn,LogOut,MessageCircle,Pencil,Plus,Search,Send,Trash2,UserPlus}from'lucide-react';import api from'./api';
const getUser=()=>{try{return JSON.parse(localStorage.getItem('blogsphere_user')||'null')}catch{return null}};
function Layout({user,onLogout,children}){return <div className="min-h-screen gradient-bg"><header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><Link to="/" className="flex items-center gap-3"><div className="rounded-2xl bg-indigo-600 p-2.5 text-white"><BookOpen/></div><div><b className="text-xl">BlogSphere</b><div className="text-xs text-slate-500">Stories & conversations</div></div></Link><nav>{user?<div className="flex items-center gap-2"><Link to="/new" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"><Plus className="mr-1 inline" size={16}/>New Post</Link><button onClick={onLogout} className="rounded-xl border p-2.5"><LogOut size={18}/></button></div>:<div className="flex gap-2"><Link to="/login" className="rounded-xl border px-4 py-2.5 font-semibold"><LogIn className="mr-1 inline" size={16}/>Login</Link><Link to="/register" className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white"><UserPlus className="mr-1 inline" size={16}/>Register</Link></div>}</nav></div></header>{children}<footer className="border-t bg-white py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} BlogSphere · Thiranex Task 4</footer></div>}
function Auth({register,onAuth}){const nav=useNavigate(),[f,setF]=useState({name:'',email:'',password:''}),[err,setErr]=useState('');async function go(e){e.preventDefault();try{const{data}=await api.post(`/auth/${register?'register':'login'}`,f);localStorage.setItem('blogsphere_token',data.token);localStorage.setItem('blogsphere_user',JSON.stringify(data.user));onAuth(data.user);nav('/')}catch(x){setErr(x.response?.data?.message||'Request failed')}}return <div className="mx-auto max-w-md px-5 py-16"><div className="rounded-3xl bg-white p-8 shadow-soft"><h1 className="text-3xl font-black">{register?'Create account':'Welcome back'}</h1><p className="mt-2 text-slate-500">{register?'Join BlogSphere.':'Sign in to manage your posts.'}</p>{err&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{err}</p>}<form onSubmit={go} className="mt-7 space-y-4">{register&&<input required placeholder="Full name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} className="w-full rounded-xl border px-4 py-3"/>}<input required type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} className="w-full rounded-xl border px-4 py-3"/><input required minLength="6" type="password" placeholder="Password (6+ characters)" value={f.password} onChange={e=>setF({...f,password:e.target.value})} className="w-full rounded-xl border px-4 py-3"/><button className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">{register?'Create account':'Login'}</button></form><p className="mt-5 text-center text-sm text-slate-500">{register?'Already have an account? ':'New here? '}<Link className="font-semibold text-indigo-600" to={register?'/login':'/register'}>{register?'Login':'Create account'}</Link></p></div></div>}
function Home(){const[posts,setPosts]=useState([]),[q,setQ]=useState('');useEffect(()=>{api.get('/posts').then(x=>setPosts(x.data))},[]);const list=useMemo(()=>posts.filter(p=>`${p.title} ${p.content} ${p.author?.name}`.toLowerCase().includes(q.toLowerCase())),[posts,q]);return <section className="mx-auto max-w-6xl px-5 py-12"><div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12"><span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Modern publishing platform</span><h1 className="mt-5 text-4xl font-black md:text-6xl">Write ideas. Start conversations.</h1><p className="mt-5 max-w-2xl text-slate-300">Create thoughtful posts, share knowledge and connect with readers.</p><div className="mt-8 flex max-w-xl items-center rounded-2xl bg-white p-2"><Search className="ml-2 text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search posts..." className="w-full bg-transparent px-3 py-2 text-slate-900 outline-none"/></div></div><h2 className="mt-10 text-3xl font-black">Latest stories</h2><div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map(p=><article key={p._id} className="rounded-3xl bg-white p-6 shadow-soft"><div className="text-xs text-slate-400">{p.category} · {new Date(p.createdAt).toLocaleDateString()}</div><Link to={`/posts/${p._id}`}><h3 className="mt-4 text-xl font-extrabold hover:text-indigo-600">{p.title}</h3></Link><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{p.excerpt}</p><div className="mt-6 flex justify-between border-t pt-4 text-sm"><b>{p.author?.name}</b><span><MessageCircle className="mr-1 inline" size={15}/>{p.commentCount}</span></div></article>)}</div>{!list.length&&<div className="mt-6 rounded-2xl bg-white p-10 text-center text-slate-500">No posts yet. Create the first one!</div>}</section>}
function Editor({edit}){const{id}=useParams(),nav=useNavigate(),[f,setF]=useState({title:'',category:'Technology',content:''}),[err,setErr]=useState('');useEffect(()=>{if(edit)api.get(`/posts/${id}`).then(x=>setF({title:x.data.title,category:x.data.category,content:x.data.content}))},[id,edit]);async function save(e){e.preventDefault();try{if(edit)await api.put(`/posts/${id}`,f);else await api.post('/posts',f);nav(edit?`/posts/${id}`:'/')}catch(x){setErr(x.response?.data?.message||'Unable to save')}}return <div className="mx-auto max-w-3xl px-5 py-12"><div className="rounded-3xl bg-white p-8 shadow-soft"><h1 className="text-3xl font-black">{edit?'Edit post':'Create a new post'}</h1>{err&&<p className="mt-3 text-red-600">{err}</p>}<form onSubmit={save} className="mt-7 space-y-5"><input required value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="Post title" className="w-full rounded-xl border px-4 py-3 text-lg font-semibold"/><select value={f.category} onChange={e=>setF({...f,category:e.target.value})} className="w-full rounded-xl border px-4 py-3"><option>Technology</option><option>AI & Data</option><option>Career</option><option>Business</option><option>Education</option></select><textarea required minLength="20" rows="14" value={f.content} onChange={e=>setF({...f,content:e.target.value})} placeholder="Write your story..." className="w-full rounded-xl border px-4 py-3 leading-7"/><button className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white">{edit?'Save changes':'Publish post'}</button></form></div></div>}
function Detail({user}){const{id}=useParams(),nav=useNavigate(),[p,setP]=useState(null),[text,setText]=useState('');const load=()=>api.get(`/posts/${id}`).then(x=>setP(x.data));useEffect(load,[id]);if(!p)return <div className="p-16 text-center">Loading...</div>;const mine=user?.id===p.author?._id;async function comment(e){e.preventDefault();if(!text.trim())return;await api.post(`/posts/${id}/comments`,{text});setText('');load()}async function del(){if(confirm('Delete this post?')){await api.delete(`/posts/${id}`);nav('/')}}return <div className="mx-auto max-w-4xl px-5 py-12"><Link to="/" className="mb-5 inline-flex items-center text-sm"><ChevronLeft size={17}/>Back</Link><article className="rounded-3xl bg-white p-8 shadow-soft"><div className="text-sm text-slate-400">{p.category} · {new Date(p.createdAt).toLocaleDateString()}</div><h1 className="mt-4 text-4xl font-black">{p.title}</h1><p className="mt-3 font-semibold text-indigo-600">By {p.author?.name}</p><div className="mt-8 whitespace-pre-wrap leading-8 text-slate-700">{p.content}</div>{mine&&<div className="mt-8 flex gap-2"><Link to={`/edit/${id}`} className="rounded-xl border px-4 py-2"><Pencil className="mr-1 inline" size={15}/>Edit</Link><button onClick={del} className="rounded-xl border border-red-200 px-4 py-2 text-red-600"><Trash2 className="mr-1 inline" size={15}/>Delete</button></div>}<section className="mt-12 border-t pt-8"><h2 className="text-2xl font-black">Comments ({p.comments.length})</h2>{user?<form onSubmit={comment} className="mt-5 flex gap-2"><textarea rows="2" value={text} onChange={e=>setText(e.target.value)} placeholder="Share your thoughts..." className="flex-1 rounded-xl border p-3"/><button className="self-end rounded-xl bg-indigo-600 p-3 text-white"><Send size={18}/></button></form>:<p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">Login to comment.</p>}<div className="mt-6 space-y-4">{p.comments.map(c=><div key={c._id} className="rounded-2xl bg-slate-50 p-4"><b>{c.user?.name}</b><span className="ml-2 text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</span><p className="mt-2 text-sm text-slate-600">{c.text}</p>{user?.id===c.user?._id&&<button onClick={async()=>{await api.delete(`/posts/${id}/comments/${c._id}`);load()}} className="mt-2 text-xs text-red-500">Delete</button>}</div>)}</div></section></article></div>}
export default function App() {
  const [user, setUser] = useState(getUser());

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Auth register={false} onAuth={setUser} />}
        />

        <Route
          path="/register"
          element={<Auth register onAuth={setUser} />}
        />

        <Route
          path="/posts/:id"
          element={<Detail user={user} />}
        />

        <Route
          path="/new"
          element={
            user ? <Editor /> : <Auth register={false} onAuth={setUser} />
          }
        />

        <Route
          path="/edit/:id"
          element={
            user ? (
              <Editor edit />
            ) : (
              <Auth register={false} onAuth={setUser} />
            )
          }
        />
      </Routes>
    </Layout>
  );
}