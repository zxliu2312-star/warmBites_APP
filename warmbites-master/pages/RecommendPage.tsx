import React, { useState } from 'react';
import { Search, Sparkles, ChevronRight, ChevronLeft, HelpCircle, Info, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageRoute, Recipe } from '../types';
import { MOCK_RECIPES, VEGETABLES, MEATS, KITCHEN_TOOLS, FLAVORS } from '../constants';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import Masonry from 'react-masonry-css';
import CollapsibleFilterGroup from '../components/CollapsibleFilterGroup'; // 导入新组件

const RecommendPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedMeats, setSelectedMeats] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);

  // 创建对应的切换函数
  const toggleVegetable = (veg: string) => toggleSelection(selectedVegetables, veg, setSelectedVegetables);
  const toggleMeat = (meat: string) => toggleSelection(selectedMeats, meat, setSelectedMeats);
  const toggleTool = (tool: string) => toggleSelection(selectedTools, tool, setSelectedTools);
  const toggleFlavor = (flavor: string) => toggleSelection(selectedFlavors, flavor, setSelectedFlavors);

  // Toggle selection for multi-select lists
  const toggleSelection = (list: string[], item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedVegetables([]);
    setSelectedMeats([]);
    setSelectedTools([]);
    setSelectedFlavors([]);
    setSearchQuery("");
  };

  // Filter recipes based on selections
  const filteredRecipes = MOCK_RECIPES.filter(recipe => {
  // 转换为小写进行不区分大小写的搜索
  const query = searchQuery.toLowerCase();
  
  // Check search query
  const matchesSearch = query === "" || 
    recipe.title.toLowerCase().includes(query) || 
    recipe.tags.some(t => t.toLowerCase().includes(query)) ||
    recipe.ingredients.some(ing => ing.toLowerCase().includes(query));

  // Check vegetables (if any selected, recipe must contain at least one)
  const hasVegetables = selectedVegetables.length === 0 ||
    selectedVegetables.some(veg =>
      recipe.ingredients.some(ing => ing.includes(veg)) ||
      recipe.tags.includes(veg)
    );

  // Check meats (if any selected, recipe must contain at least one)
  const hasMeats = selectedMeats.length === 0 ||
    selectedMeats.some(meat =>
      recipe.ingredients.some(ing => ing.includes(meat)) ||
      recipe.tags.includes(meat)
    );

  // Check flavors (if any selected, recipe must contain at least one)
  const hasFlavors = selectedFlavors.length === 0 ||
    selectedFlavors.some(flavor => recipe.tags.includes(flavor));

  // Check kitchen tools (if any selected, recipe must contain at least one)
  const hasTools = selectedTools.length === 0 ||
    (recipe.kitchenTools && 
     selectedTools.some(tool => recipe.kitchenTools.includes(tool))
    );

  return matchesSearch && hasVegetables && hasMeats && hasFlavors && hasTools;
});

  return (
    <div className="min-h-screen bg-warm-bg pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-warm-bg/95 backdrop-blur-md shadow-sm py-4 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <button
        onClick={() => navigate(PageRoute.EXPLORE)}  // 返回到探索页面
        className="p-2 hover:bg-white rounded-full transition-colors text-warm-textDark flex items-center gap-2 md:gap-1.5"
        aria-label="返回探索页"
      >
        <ChevronLeft size={20} />
        <span className="hidden md:inline text-sm font-medium"></span>
      </button>

          <div
            onClick={() => navigate(PageRoute.LANDING)}
            className="text-2xl font-bold text-warm-textDark cursor-pointer whitespace-nowrap"
          >
            暖食记
          </div>

          {/* Mobile Buttons (Help/About/AI) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => navigate(PageRoute.HELP)}
              className="p-2 text-warm-textLight hover:text-warm-primary transition-colors"
              aria-label="帮助"
            >
              <HelpCircle size={22} />
            </button>
            <button
              onClick={() => navigate(PageRoute.ABOUT)}
              className="p-2 text-warm-textLight hover:text-warm-primary transition-colors"
              aria-label="关于"
            >
              <Info size={22} />
            </button>
            <button
              onClick={() => navigate(PageRoute.AI_CHEF)}
              className="bg-warm-secondary p-2 rounded-full text-warm-textDark"
            >
              <Sparkles size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg relative group">
          <input
            type="text"
            placeholder="搜索你喜欢的口味..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-transparent focus:border-warm-primary/50 text-warm-textDark rounded-full py-2.5 pl-4 pr-10 outline-none transition-all shadow-sm group-hover:shadow-md"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-textLight" size={20} />
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate(PageRoute.HELP)}
            className="flex items-center gap-1.5 px-3 py-2 text-warm-textDark font-medium hover:bg-white rounded-lg transition-colors"
          >
            <HelpCircle size={18} />
            <span>帮助</span>
          </button>

          <button
            onClick={() => navigate(PageRoute.ABOUT)}
            className="flex items-center gap-1.5 px-3 py-2 text-warm-textDark font-medium hover:bg-white rounded-lg transition-colors"
          >
            <Info size={18} />
            <span>关于我们</span>
          </button>

          <button
            onClick={() => navigate(PageRoute.AI_CHEF)}
            className="flex items-center gap-2 bg-gradient-to-r from-warm-secondary to-orange-300 text-warm-textDark px-5 py-2.5 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all ml-2"
          >
            <Sparkles size={18} />
            <span>试试AI帮厨</span>
          </button>
        </div>
      </header>

      {/* Page Title */}
      <section className="px-4 md:px-8 py-6 flex items-center gap-2">
        <Filter size={24} className="text-warm-primary" />
        <h1 className="text-3xl font-bold text-warm-textDark">智能食谱推荐</h1>
      </section>

      {/* Filter Section */}
      <section className="px-4 md:px-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex flex-wrap gap-4 md:gap-8">
            {/* Vegetables */}
            <CollapsibleFilterGroup
              title="蔬菜"
              items={VEGETABLES}
              selectedItems={selectedVegetables}
              onToggleItem={toggleVegetable}
              maxVisible={9}
            />

            {/* Meats */}
            <CollapsibleFilterGroup
              title="肉类"
              items={MEATS}
              selectedItems={selectedMeats}
              onToggleItem={toggleMeat}
              maxVisible={9}
            />

            {/* Kitchen Tools */}
            <CollapsibleFilterGroup
              title="厨具"
              items={KITCHEN_TOOLS}
              selectedItems={selectedTools}
              onToggleItem={toggleTool}
              maxVisible={9}
            />

            {/* Flavors */}
            <CollapsibleFilterGroup
              title="口味"
              items={FLAVORS}
              selectedItems={selectedFlavors}
              onToggleItem={toggleFlavor}
              maxVisible={9}
            />
          </div>

          {/* Clear Button */}
          {(selectedVegetables.length > 0 || selectedMeats.length > 0 ||
            selectedTools.length > 0 || selectedFlavors.length > 0 || searchQuery) && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={clearAllSelections}
                  className="bg-gray-100 hover:bg-gray-200 text-warm-textDark px-5 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Filter size={18} />
                  <span>清除所有筛选</span>
                </button>
              </div>
            )}
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-warm-textDark">推荐食谱 ({filteredRecipes.length})</h2>
        </div>

        <Masonry
          breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
          className="flex -ml-6 w-auto"
          columnClassName="pl-6 bg-clip-padding"
        >
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={setModalRecipe}
            />
          ))}
          {filteredRecipes.length === 0 && (
            <div className="text-center py-20 text-warm-textLight col-span-full">
              <p>没有找到符合条件的菜谱，试试调整筛选条件？😋</p>
            </div>
          )}
        </Masonry>
      </section>

      {/* Modal */}
      {modalRecipe && (
        <RecipeModal recipe={modalRecipe} onClose={() => setModalRecipe(null)} />
      )}
    </div>
  );
};

export default RecommendPage;