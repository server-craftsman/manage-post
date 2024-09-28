import PostList from "../../components/customer/posts/PostList";
import Cover from "../../components/customer/Cover";
import { motion } from "framer-motion";
const Home = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Cover />
      <PostList />
    </motion.div>
  )
}

export default Home;
