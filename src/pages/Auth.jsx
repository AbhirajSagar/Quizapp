import { useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)

    const handleAuth = async () => 
    {
        setLoading(true);
        if (isLogin) 
        {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            console.log({ data, error });
        }
        else 
        {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options:
                {
                    data:
                    {
                        name: name,
                    }
                }
            });

            if (signUpError) 
            {
                console.error(signUpError);
                setLoading(false);
                return;
            }

            const { data: profileTableData, error } = await supabase
                .from('profiles')
                .insert(
                    [
                        {
                            id: signUpData.user?.id,
                            name: signUpData.user?.user_metadata?.name,
                            email: signUpData.user?.email,
                            friends: [],
                            institution: null
                        }
                    ]);

            if (error) 
            {
                console.log('data',data);
                console.error(error);
                setLoading(false);
                return;
            }
            else console.log(profileTableData);
        }

        setLoading(false);
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-light-primary dark:bg-dark-primary px-4">
            <div className="bg-white dark:bg-dark-secondary p-8 rounded-2xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6 dark:text-light-primary">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-one dark:bg-dark-primary dark:text-light-primary"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-one dark:bg-dark-primary dark:text-light-primary"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-one dark:bg-dark-primary dark:text-light-primary"
                />
                <button
                    onClick={handleAuth}
                    disabled={loading}
                    className="w-full py-2 bg-accent-one text-white rounded-md hover:bg-accent-two transition disabled:opacity-50"
                >
                    {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
                </button>
                <p
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-4 text-center text-sm text-accent-one cursor-pointer"
                >
                    {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
                </p>
            </div>
        </div>
    )
}

export default AuthPage
