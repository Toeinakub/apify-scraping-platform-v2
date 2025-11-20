'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { RotateCw, Eye } from 'lucide-react';
import ExportClassificationButton from './ExportClassificationButton';

interface ClassificationResultsProps {
  classificationResults: any;
  sourceType: string;
  sessionId?: string;
  onReclassify?: () => void;
  sessionResults?: any[]; // For extracting URLs
  showReclassify?: boolean;
}

export default function ClassificationResults({
  classificationResults,
  sourceType,
  sessionId = 'unknown',
  onReclassify,
  sessionResults = [],
  showReclassify,
}: ClassificationResultsProps) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isReclassifying, setIsReclassifying] = useState(false);

  if (!classificationResults) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No classification data available</p>
      </Card>
    );
  }

  const { totalItems, classifiedItems, summary } = classificationResults;

  const handleReclassify = async () => {
    setIsReclassifying(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/reclassify`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to re-classify');
      }

      // Trigger refresh by calling parent callback if provided
      if (onReclassify) {
        await onReclassify();
      } else {
        // Fallback: reload the page
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Re-classify error:', error);
      alert(`Failed to re-classify: ${error.message}`);
      setIsReclassifying(false);
    }
  };

  // Render Summary Cards
  const renderSummarySection = () => {
    // Check if it's a Group (any group type) or a Page
    const isGroup = sourceType.includes('GROUP');

    if (isGroup) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.topIntents && summary.topIntents.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Top Intents</h3>
              {summary.topIntents.slice(0, 5).map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.intent}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </Card>
          )}
          {summary.topPainPoints && summary.topPainPoints.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Top Pain Points</h3>
              {summary.topPainPoints.slice(0, 5).map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.painPoint}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </Card>
          )}
          {summary.topMaterialCategories && summary.topMaterialCategories.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Top Materials</h3>
              {summary.topMaterialCategories.slice(0, 5).map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.category}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </Card>
          )}
          {summary.topHouseZones && summary.topHouseZones.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Top House Zones</h3>
              {summary.topHouseZones.slice(0, 5).map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.zone}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </Card>
          )}
        </div>
      );
    } else {
      // Competitor Page
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.topProducts && summary.topProducts.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Top Products</h3>
              {summary.topProducts.slice(0, 5).map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.product}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </Card>
          )}
          {summary.topModels && summary.topModels.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Models</h3>
              <div className="flex flex-wrap gap-1">
                {summary.topModels.slice(0, 10).map((item: any, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {item.model}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
          {summary.topValueProps && summary.topValueProps.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Value Props</h3>
              <div className="flex flex-wrap gap-1">
                {summary.topValueProps.slice(0, 10).map((item: any, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {item.valueProp}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
          {summary.contentTypeDistribution && summary.contentTypeDistribution.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Content Types</h3>
              {summary.contentTypeDistribution.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item.type}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </Card>
          )}
        </div>
      );
    }
  };

  // Render Table based on sourceType
  const renderTable = () => {
    const isGroup = sourceType.includes('GROUP');

    if (isGroup) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[200px]">URL</TableHead>
              <TableHead className="w-[250px]">Post Preview</TableHead>
              <TableHead>Primary Intent</TableHead>
              <TableHead>House Zones</TableHead>
              <TableHead>Pain Points</TableHead>
              <TableHead>Materials</TableHead>
              <TableHead>Journey Stage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classifiedItems.map((item: any, index: number) => {
              const originalResult = sessionResults[index] || {};
              const url = originalResult.url || originalResult.postUrl || '-';
              const textPreview = item.originalText?.slice(0, 100) || '-';

              return (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-xs truncate" title={url}>
                    {url !== '-' ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {url.length > 40 ? url.slice(0, 40) + '...' : url}
                      </a>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-xs truncate" title={item.originalText}>
                    {textPreview}...
                  </TableCell>
                  <TableCell>
                    {item.classification.primaryIntent && (
                      <Badge>{item.classification.primaryIntent}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.classification.houseZones?.slice(0, 2).map((zone: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{zone}</Badge>
                      ))}
                      {item.classification.houseZones?.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{item.classification.houseZones.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.classification.painPoints?.slice(0, 2).map((pp: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{pp}</Badge>
                      ))}
                      {item.classification.painPoints?.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{item.classification.painPoints.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.classification.materialCategories?.slice(0, 2).map((mat: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{mat}</Badge>
                      ))}
                      {item.classification.materialCategories?.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{item.classification.materialCategories.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.classification.journeyStages?.slice(0, 1).map((stage: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{stage}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    } else {
      // Competitor Page
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[200px]">URL</TableHead>
              <TableHead className="w-[250px]">Post Preview</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Models</TableHead>
              <TableHead>Value Props</TableHead>
              <TableHead>Content Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classifiedItems.map((item: any, index: number) => {
              const originalResult = sessionResults[index] || {};
              const url = originalResult.url || originalResult.postUrl || '-';
              const textPreview = item.originalText?.slice(0, 100) || '-';

              return (
                <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-xs truncate" title={url}>
                    {url !== '-' ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {url.length > 40 ? url.slice(0, 40) + '...' : url}
                      </a>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-xs truncate" title={item.originalText}>
                    {textPreview}...
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.classification.products?.map((product: string, i: number) => (
                        <Badge key={i} variant="default">{product}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.classification.models?.slice(0, 2).map((model: string, i: number) => (
                        <Badge key={i} variant="outline">{model}</Badge>
                      ))}
                      {item.classification.models?.length > 2 && (
                        <Badge variant="outline">+{item.classification.models.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.classification.valueProps?.slice(0, 2).map((vp: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{vp}</Badge>
                      ))}
                      {item.classification.valueProps?.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{item.classification.valueProps.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.classification.contentType}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export and Re-classify buttons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Classification Summary</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Classified {totalItems} items from this session using AI
            </p>
          </div>
          <div className="flex gap-2">
            {showReclassify !== false && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReclassify}
                disabled={isReclassifying}
              >
                <RotateCw className={`mr-2 h-4 w-4 ${isReclassifying ? 'animate-spin' : ''}`} />
                {isReclassifying ? 'Re-classifying...' : 'Re-classify'}
              </Button>
            )}
            <ExportClassificationButton
              classificationResults={classificationResults}
              sessionId={sessionId}
            />
          </div>
        </div>
        {renderSummarySection()}
      </div>

      {/* Classified Items Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Classified Items</h2>
        <Card>
          <div className="overflow-x-auto">
            {renderTable()}
          </div>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Classification Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Original Text:</h3>
                <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                  {selectedItem.originalText}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Classification:</h3>
                <div className="space-y-3">
                  {sourceType.includes('GROUP') ? (
                    <>
                      {selectedItem.classification.primaryIntent && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Primary Intent:</h4>
                          <Badge>{selectedItem.classification.primaryIntent}</Badge>
                        </div>
                      )}
                      {selectedItem.classification.intents && selectedItem.classification.intents.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">All Intents:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.intents.map((intent: string, i: number) => (
                              <Badge key={i} variant="secondary">{intent}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.classification.houseZones && selectedItem.classification.houseZones.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">House Zones:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.houseZones.map((zone: string, i: number) => (
                              <Badge key={i} variant="outline">{zone}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.classification.painPoints && selectedItem.classification.painPoints.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Pain Points:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.painPoints.map((pp: string, i: number) => (
                              <Badge key={i} variant="destructive">{pp}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.classification.materialCategories && selectedItem.classification.materialCategories.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Material Categories:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.materialCategories.map((mat: string, i: number) => (
                              <Badge key={i} variant="outline">{mat}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.classification.journeyStages && selectedItem.classification.journeyStages.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Journey Stages:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.journeyStages.map((stage: string, i: number) => (
                              <Badge key={i} variant="secondary">{stage}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.classification.personas && selectedItem.classification.personas.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Personas:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.personas.map((persona: string, i: number) => (
                              <Badge key={i} variant="default">{persona}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {selectedItem.classification.products && selectedItem.classification.products.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Products:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.products.map((product: string, i: number) => (
                              <Badge key={i} variant="default">{product}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.classification.models && selectedItem.classification.models.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Models:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.models.map((model: string, i: number) => (
                              <Badge key={i} variant="outline">{model}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.classification.valueProps && selectedItem.classification.valueProps.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Value Propositions:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedItem.classification.valueProps.map((vp: string, i: number) => (
                              <Badge key={i} variant="secondary">{vp}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.classification.contentType && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Content Type:</h4>
                          <Badge variant="outline">{selectedItem.classification.contentType}</Badge>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
