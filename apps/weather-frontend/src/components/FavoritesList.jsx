import { Star, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LocationService } from "../services/locationService";

export function FavoritesList({ favorites, onSelect, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleDelete = (id, e) => {
    e.stopPropagation();
    LocationService.removeFavorite(id);
    onUpdate();
  };

  const startEdit = (favorite, e) => {
    e.stopPropagation();
    setEditingId(favorite.id);
    setEditName(favorite.name);
  };

  const saveEdit = (id, e) => {
    e.stopPropagation();
    if (editName.trim()) {
      LocationService.updateFavoriteName(id, editName.trim());
      onUpdate();
    }
    setEditingId(null);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No favorite locations yet.</p>
          <p className="text-sm mt-2">
            Search for a location and add it to your favorites!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((favorite) => (
        <Card
          key={favorite.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => !editingId && onSelect(favorite)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 fill-yellow-500" />
                {editingId === favorite.id ? (
                  <div
                    className="flex items-center gap-2 flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveEdit(favorite.id, e);
                        } else if (e.key === "Escape") {
                          cancelEdit(e);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => saveEdit(favorite.id, e)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <CardTitle className="truncate">{favorite.name}</CardTitle>
                )}
              </div>
              {!editingId && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => startEdit(favorite, e)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDelete(favorite.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              {favorite.city}, {favorite.state}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {favorite.latitude.toFixed(4)}, {favorite.longitude.toFixed(4)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
