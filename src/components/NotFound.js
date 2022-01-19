import '../index.css';

function NotFound() {

    return (
        <>
            <main>
                <h1 className='text-center'>404</h1>
                <p className='text-center'>The page you are trying to access does not exist.</p>
                <div className='text-center'>
                    <a className="btn  btn-primary" href="/">Home</a>
                </div>
            </main>
        </>

    );

}

export default NotFound;