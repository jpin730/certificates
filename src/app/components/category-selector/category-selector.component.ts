import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-category-selector',
  standalone: true,
  templateUrl: './category-selector.component.html',
})
export class CategorySelectorComponent {
  @Output() categoryChange = new EventEmitter<string>()

  @Input() set categories(categories: string[]) {
    this._categories = [this.defaultCategory, ...categories]
  }

  defaultCategory = 'All'
  _categories: string[] = []
  selectedCategory = this.defaultCategory

  onSelectCategory(category: string): void {
    this.selectedCategory = category
    this.categoryChange.emit(category)
  }
}
