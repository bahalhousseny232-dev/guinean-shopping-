import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';

const products = [
  {
    id: 1,
    name: 'Nike Air Max',
    price: 450000,
    category: 'Chaussures',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    id: 2,
    name: 'Sneakers tendance',
    price: 280000,
    category: 'Chaussures',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    id: 3,
    name: 'Veste moderne',
    price: 350000,
    category: 'Vêtements',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
  },
  {
    id: 4,
    name: 'T-shirt Premium',
    price: 120000,
    category: 'Vêtements',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
  },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('Tout');
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);

  const formatPrice = (price) =>
    price.toLocaleString('fr-FR') + ' GNF';

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    Alert.alert('Succès', product.name + ' ajouté au panier !');
  };

  const changeQuantity = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      category === 'Tout' || product.category === category;

    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkout = () => {
    if (cart.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez d’abord des produits.');
      return;
    }

    Alert.alert(
      'Commande',
      'Votre panier contient ' + cartCount +
      ' article(s), pour un total de ' + formatPrice(total) +
      '. Le paiement sera ajouté dans une prochaine étape.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>🇬🇳 GUINÉE SHOPPING</Text>
          <Text style={styles.subtitle}>
            Achetez facilement en Guinée
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setShowCart(!showCart)}
        >
          <Text style={styles.cartText}>🛒 {cartCount}</Text>
        </TouchableOpacity>
      </View>

      {showCart ? (
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Mon panier</Text>

          {cart.length === 0 ? (
            <Text style={styles.empty}>
              Votre panier est vide.
            </Text>
          ) : (
            cart.map((item) => (
              <View style={styles.cartItem} key={item.id}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>
                    {item.name}
                  </Text>
                  <Text style={styles.price}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>

                <View style={styles.quantity}>
                  <TouchableOpacity
                    onPress={() => changeQuantity(item.id, -1)}
                  >
                    <Text style={styles.quantityButton}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityNumber}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => changeQuantity(item.id, 1)}
                  >
                    <Text style={styles.quantityButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <Text style={styles.total}>
            Total : {formatPrice(total)}
          </Text>

          <TouchableOpacity
            style={styles.orderButton}
            onPress={checkout}
          >
            <Text style={styles.orderText}>Commander</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowCart(false)}
          >
            <Text style={styles.backText}>
              Retour à la boutique
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>
              Bienvenue chez nous !
            </Text>
            <Text style={styles.bannerText}>
              Découvrez les meilleurs articles au meilleur prix.
            </Text>
          </View>

          <TextInput
            style={styles.search}
            placeholder="🔍 Rechercher un article..."
            value={search}
            onChangeText={setSearch}
          />

          <Text style={styles.title}>Catégories</Text>

          <View style={styles.categories}>
            {['Tout', 'Chaussures', 'Vêtements'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  category === item && styles.activeCategory,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.activeCategoryText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.title}>Nos produits</Text>

          <View style={styles.products}>
            {filteredProducts.map((product) => (
              <View style={styles.card} key={product.id}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />

                <Text style={styles.productName}>
                  {product.name}
                </Text>

                <Text style={styles.price}>
                  {formatPrice(product.price)}
                </Text>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(product)}
                >
                  <Text style={styles.addText}>
                    + Ajouter au panier
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {filteredProducts.length === 0 && (
            <Text style={styles.empty}>
              Aucun produit trouvé.
            </Text>
          )}

          <Text style={styles.footer}>
            GUINÉE SHOPPING © 2026
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#087A45',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#E1F5E8',
    fontSize: 12,
    marginTop: 5,
  },
  cartButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
  },
  cartText: {
    fontWeight: 'bold',
    color: '#087A45',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: '#087A45',
    padding: 22,
    borderRadius: 15,
    marginBottom: 20,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
  },
  bannerText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
  },
  search: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 15,
    marginTop: 10,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryButton: {
    padding: 11,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeCategory: {
    backgroundColor: '#087A45',
  },
  categoryText: {
    color: '#333333',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  products: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 14,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 125,
    borderRadius: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    color: '#222222',
  },
  price: {
    color: '#087A45',
    fontWeight: 'bold',
    marginTop: 7,
    fontSize: 13,
  },
  addButton: {
    backgroundColor: '#087A45',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    color: '#777777',
    padding: 25,
  },
  empty: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 25,
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    fontSize: 22,
    color: '#087A45',
    fontWeight: 'bold',
  },
  quantityNumber: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#087A45',
    marginTop: 20,
  },
  orderButton: {
    backgroundColor: '#087A45',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  orderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backText: {
    color: '#087A45',
    fontWeight: 'bold',
  },
});
