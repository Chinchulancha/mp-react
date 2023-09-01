import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";

const Product = () => {
  const [cart, setCart] = useState([]); // Estado del carrito

  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)

  const products = [
    {
      img: "https://lh3.googleusercontent.com/wih8aJ7CK54iXhBi8g7vVWGOfsvHDdGUYJ4mThxQe4vDJEY9gTvyTEKOdfy0a9QOwPuy9_6DC-5zD91fIPCY=s400",
      name: "aldeano",
      price: 100,
    },
    {
      img: "https://lh3.googleusercontent.com/NgYj3DoxTihNJ2lvIBO_0zXkj3eocVvxKrerC9WLqfeWPqbw4SH4PAF509cKvSI1weZ3ug-412GGUM3C_i5x_Q=s400",
      name: "steve",
      price: 10,
    },
    {
      img: "https://lh3.googleusercontent.com/K3n1dJmDhEDJJGGlGA-a-TSEhHOEoDuXiT-VlCFIsqNiZi5OgLcVI8edbMz9K1fDaaoN4IGWBehKwXcsxxkVFH9RrnvsKKkaCzY=s400",
      name: "zombie",
      price: 999,
    },
  ];

  const addProduct = (product) => {
    setTotalPrice(totalPrice + product.price)

    // Comprobar si el producto ya está en el carrito
    const existingProduct = cart.find((item) => item.name === product.name);

    if (existingProduct) {
      // Si el producto ya está en el carrito, aumenta la cantidad
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Si el producto no está en el carrito, agrégalo con cantidad 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setTotalQuantity(totalQuantity + 1);
  };

  const [preferenceId, setPreferenceId] = useState(null);

  initMercadoPago("TEST-704f640c-883b-4143-a7bc-d548adc131a5");

  const createPreference = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/create_preference",
        {
          description: cart.length > 1 ? 'Esclavos' : 'Esclavo',
          price: totalPrice,
          quantity: totalQuantity,
        }
      );

      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();

    if (id) {
      setPreferenceId(id);
    }
  };

  return (
    <div className="bg-yellow-500 text-white font-semibold">
      <div className="pt-12 px-12 pb-5">
        <div className="flex flex-col gap-y-12">
          <h3 className="text-3xl bg-black text-yellow-500 rounded text-center p-2">
            Tienda de esclavos👍🏿
          </h3>
          <div className="flex gap-x-14">
            {products.map(({ img, name, price }, index) => (
              <div key={index}>
                <div className="text-white flex flex-col">
                  <div>
                    <img src={img} alt={name} />
                  </div>
                  <div>
                    <h3 className="text-center uppercase text-2xl">{name}</h3>
                  </div>
                  <div>
                    <p className="text-center font-bold text-black">${price}</p>
                  </div>
                  <button
                    className="bg-red-500 py-2"
                    onClick={() => addProduct({ name, price })}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div>
          <div className="pb-4">
        <h2 className="text-2xl font-semibold">Carrito de compras</h2>
        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - Cantidad: {item.quantity} - Precio: $
                {item.price * item.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>
            <button className="bg-green-500 py-4 w-full" onClick={handleBuy}>
              Esclavizar
            </button>
        
            {preferenceId && <Wallet initialization={{ preferenceId }} />}
            
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Product;
