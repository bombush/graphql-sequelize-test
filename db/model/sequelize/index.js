const prepareModels = (Sequelize, sequelize) => {

  const Users = sequelize.define(
    'users',
    {
      'id_user': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: Sequelize.STRING,
      name: Sequelize.STRING
    },
    {
      timestamps: false
    }
  );

  const U_Names = sequelize.define(
    'u_name',
    {
      name: Sequelize.STRING
    }
  );

  const Category = sequelize.define(
    'category',
    {
      'id': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    },
    {
      tableName: 'category',
      timestamps: false
    }
  );

  const T_Categories = sequelize.define(
    't_categories',
    {
      'lang_version': Sequelize.STRING,
      name: Sequelize.STRING
    },
    {
      timestamps: false
    }
  );
  T_Categories.removeAttribute('id');

  //Users.hasMany(U_Names, { foreignKey: 'id_user'});
  //U_Names.belongsTo(Users, { foreignKey: 'id_user'});

  const relCategoryT_Categories = Category.hasMany(T_Categories, { foreignKey: 'id_category'});
  const relT_CategoriesCategory = T_Categories.belongsTo(Category, { foreignKey: 'id'});

  return {
    sequelize,
    Users,
    //U_Names,
    Category,
    T_Categories,
    relCategoryT_Categories,
    relT_CategoriesCategory
  };
};

export default prepareModels;
